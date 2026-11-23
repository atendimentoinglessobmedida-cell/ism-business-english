const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createMetrics } = require('../result-metrics.js');

function setup() {
  let payload = null;
  let time = new Date(2026, 10, 23, 12).getTime();
  const storage = {
    getItem: () => payload,
    setItem: (_key, value) => { payload = value; }
  };
  const metrics = createMetrics({ storage, now: () => time, createId: () => 'fake-random-id' });
  return {
    metrics, storage,
    data: () => JSON.parse(payload),
    advance: (milliseconds) => { time += milliseconds; }
  };
}

test('participation is off by default and can be withdrawn', () => {
  const { metrics, data } = setup();
  metrics.visit();
  metrics.startLesson('2.1');
  metrics.loginError();
  assert.equal(data(), null);
  assert.equal(metrics.setParticipation(true), true);
  assert.equal(metrics.participating(), true);
  metrics.audioFailure();
  assert.equal(data().audioFailures, 1);
  metrics.setParticipation(false);
  metrics.audioFailure();
  assert.deepEqual(data(), { participating: false });
});

test('lesson and stage counts are idempotent and exclude input and error messages', () => {
  const { metrics, data, advance } = setup();
  const fictionalText = 'rascunho fictício';
  metrics.setParticipation(true);
  advance(15_000);
  metrics.startLesson('2.1', fictionalText);
  metrics.startLesson('2.1');
  metrics.completeStage('2.1', 2);
  metrics.completeStage('2.1', 2);
  assert.equal(metrics.completeStage('2.1', 8), false);
  assert.equal(metrics.startLesson(fictionalText), false);
  assert.equal(metrics.completeLesson('2.2'), false);
  metrics.loginError(fictionalText);
  metrics.audioFailure(fictionalText);
  assert.equal(metrics.rateEase(5), false);
  advance(75_000);
  assert.equal(metrics.completeLesson('2.1'), true);
  assert.equal(metrics.completeLesson('2.1'), false);
  assert.equal(metrics.rateEase(6), false);
  assert.equal(metrics.rateEase(4), true);
  assert.equal(metrics.rateEase(5), false);
  assert.deepEqual(data().lessons, { '2.1': { completed: true, stages: 4 } });
  assert.equal(data().firstStartSeconds, 15);
  assert.equal(data().firstCompletionSeconds, 90);
  assert.equal(data().loginErrors, 1);
  assert.equal(data().audioFailures, 1);
  assert.equal(data().ease, 4);
  assert.equal(JSON.stringify(data()).includes(fictionalText), false);
});

test('D1 and D7 count visits on the designated calendar days across reloads', () => {
  const { metrics, data, advance } = setup();
  metrics.setParticipation(true);
  metrics.visit();
  assert.equal(data().returnD1, false);
  advance(86_400_000);
  metrics.visit();
  assert.equal(data().returnD1, true);
  assert.equal(data().returnD7, false);
  advance(6 * 86_400_000);
  metrics.visit();
  assert.equal(data().returnD7, true);
});

test('when browser storage is blocked, metrics do not interrupt the course', () => {
  const metrics = createMetrics({
    storage: {
      getItem() { throw new Error('blocked'); },
      setItem() { throw new Error('blocked'); }
    },
    createId: () => 'fake-random-id'
  });
  assert.equal(metrics.setParticipation(true), false);
  assert.equal(metrics.startLesson('2.1'), false);
  assert.equal(metrics.participating(), false);
});
