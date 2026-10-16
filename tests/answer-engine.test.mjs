import assert from 'node:assert/strict';
import {prepareQuiz, gradeChoice} from '../src/learning/answer-engine.mjs';
const questions = Array.from({length: 15}, (_, index) => ({
 id: 'q' + index,
 options: ['a','b','c'].map(id => ({id, text: id})),
 correctOptionId: 'b'
}));
for (let run = 0; run < 100; run++) {
 const result = prepareQuiz(questions);
 const positions = [0,0,0];
 result.forEach(q => {
   const index = q.options.findIndex(o => o.id === q.correctOptionId);
   positions[index]++;
   assert.equal(gradeChoice(q,'b'),true);
   assert.equal(gradeChoice(q,'a'),false);
 });
 assert.deepEqual(positions,[5,5,5]);
}
assert.throws(() => prepareQuiz([{options:[{id:'a'},{id:'a'}],correctOptionId:'a'}]));
console.log('PASS: 100 quizzes, distribuição 5/5/5 e gabarito por ID');
