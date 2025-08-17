// Step 6 - Phrasal Verbs Multi-Select evaluator (partial scoring)
export interface PhrasalVerbOption {
  text: string;
  correct: boolean;
}

export interface MultiSelectResult {
  correctCount: number;
  incorrectCount: number;
  score: number; // 0..1
}

export function evaluatePhrasalMultiSelect(options: PhrasalVerbOption[], selected: string[]): MultiSelectResult {
  let correctCount = 0;
  let incorrectCount = 0;
  const totalCorrect = options.filter(o => o.correct).length;
  for (const opt of options) {
    const picked = selected.includes(opt.text);
    if (picked && opt.correct) correctCount++;
    if (picked && !opt.correct) incorrectCount++;
  }
  const score = totalCorrect > 0 ? Math.max(0, correctCount - incorrectCount) / totalCorrect : 0;
  return { correctCount, incorrectCount, score };
}
