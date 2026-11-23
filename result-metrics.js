/* Aggregate counters for one participating browser. There is no network transport. */
(function (root) {
  'use strict';

  const key = 'ism-business:result-metrics:v1';
  const day = (time) => {
    const date = new Date(time);
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
  };
  const elapsed = (start, end) => Math.max(0, Math.floor((end - start) / 1000));

  function createMetrics({ storage, now = Date.now, createId }) {
    const openedAt = now();

    function read() {
      try {
        const state = JSON.parse(storage.getItem(key));
        return state?.participating === true && (!state.lessons || typeof state.lessons !== 'object')
          ? null
          : state;
      } catch {
        return null;
      }
    }

    function write(state) {
      try {
        storage.setItem(key, JSON.stringify(state));
        return true;
      } catch {
        return false;
      }
    }

    function update(change) {
      const state = read();
      if (state?.participating !== true) return false;
      const time = now();
      const today = day(time);
      state.lastDay = today;
      if (today - state.firstDay === 1) state.returnD1 = true;
      if (today - state.firstDay === 7) state.returnD7 = true;
      change(state, time);
      return write(state);
    }

    function setParticipation(enabled) {
      if (!enabled) return write({ participating: false });
      if (read()?.participating === true) return update(() => {});
      const time = now();
      return write({
        participating: true, id: createId(), firstDay: day(time), lastDay: day(time),
        firstAt: openedAt, firstStartSeconds: null, firstCompletionSeconds: null,
        returnD1: false, returnD7: false, lessons: {}, loginErrors: 0, audioFailures: 0,
        ease: null
      });
    }

    function lessonId(value) {
      return typeof value === 'string' && /^(?:[1-9]|1[0-2])\.[1-9]\d?$/.test(value);
    }

    function startLesson(id) {
      if (!lessonId(id)) return false;
      return update((state, time) => {
        state.lessons[id] ??= { completed: false, stages: 0 };
        state.firstStartSeconds ??= elapsed(state.firstAt, time);
      });
    }

    function completeStage(id, index) {
      if (!lessonId(id) || !Number.isInteger(index) || index < 0 || index >= 8) return false;
      return update((state) => {
        if (state.lessons[id]) state.lessons[id].stages |= 1 << index;
      });
    }

    function completeLesson(id) {
      if (!lessonId(id)) return false;
      let invite = false;
      const saved = update((state, time) => {
        const lesson = state.lessons[id];
        if (!lesson || lesson.completed) return;
        lesson.completed = true;
        invite = state.firstCompletionSeconds === null;
        state.firstCompletionSeconds ??= elapsed(state.firstAt, time);
      });
      return invite && saved;
    }

    function rateEase(value) {
      if (!Number.isInteger(value) || value < 1 || value > 5) return false;
      const state = read();
      if (state?.firstCompletionSeconds == null || state.ease !== null) return false;
      return update((current) => {
        current.ease = value;
      });
    }

    return Object.freeze({
      participating: () => read()?.participating === true,
      setParticipation,
      visit: () => update(() => {}),
      startLesson, completeStage, completeLesson, rateEase,
      loginError: () => update((state) => { state.loginErrors += 1; }),
      audioFailure: () => update((state) => { state.audioFailures += 1; })
    });
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { createMetrics };
    return;
  }
  try {
    root.ISMResultMetrics = createMetrics({
      storage: root.localStorage,
      createId: () => root.crypto.randomUUID()
    });
    root.ISMResultMetrics.visit();
  } catch {
    // Metrics may be disabled by browser storage settings.
  }
})(globalThis);
