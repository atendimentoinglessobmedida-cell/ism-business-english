/**
 * Motor de alternativas ISM: preserva gabarito por ID e distribui posições.
 * Uso: prepareQuiz(questions, {random: Math.random}) antes de exibir cada tentativa.
 */
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function prepareQuiz(questions, {random = Math.random} = {}) {
  if (!Array.isArray(questions)) throw new TypeError('Questões inválidas');
  const groups = new Map();
  for (const question of questions) {
    if (!question || !Array.isArray(question.options) || question.options.length < 2) throw new Error('Questão sem alternativas');
    const ids = question.options.map(option => option.id);
    if (new Set(ids).size !== ids.length || !ids.includes(question.correctOptionId)) throw new Error('Gabarito inválido');
    const count = question.options.length;
    if (!groups.has(count)) groups.set(count, []);
    groups.get(count).push(question);
  }
  const targets = new Map();
  for (const [count, group] of groups) {
    const positions = Array.from({length: group.length}, (_, index) => index % count);
    targets.set(count, shuffle(positions, random));
  }
  return questions.map(question => {
    const count = question.options.length;
    const target = targets.get(count).shift();
    const correct = question.options.find(option => option.id === question.correctOptionId);
    const distractors = shuffle(question.options.filter(option => option.id !== question.correctOptionId), random);
    distractors.splice(target, 0, correct);
    return {...question, options: distractors};
  });
}

export function gradeChoice(question, selectedOptionId) {
  return selectedOptionId === question.correctOptionId;
}
