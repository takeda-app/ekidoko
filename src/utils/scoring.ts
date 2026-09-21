export const POINTS_PER_CORRECT_ANSWER = 1000;

export function pointsForAnswer(correct: boolean): number {
  return correct ? POINTS_PER_CORRECT_ANSWER : 0;
}

export function titleForScore(correctCount: number, totalQuestions: number): string {
  const ratio = correctCount / totalQuestions;
  if (ratio === 1) return '駅マスター！';
  if (ratio >= 0.8) return 'かなりの駅オタク！';
  if (ratio >= 0.6) return '駅にちょっと詳しい人';
  if (ratio >= 0.4) return 'まだまだこれから';
  return '駅初心者';
}
