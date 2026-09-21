import { titleForScore } from '../utils/scoring';
import type { GameResult } from '../types';

interface ResultScreenProps {
  result: GameResult;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const maxScore = result.totalQuestions * 1000;
  return (
    <div className="screen screen--result">
      <p className="result-label">RESULT</p>
      <p className="result-headline">
        {result.totalQuestions}問中 {result.correctCount}問正解！
      </p>
      <p className="result-score">
        {result.totalScore} / {maxScore} pt
      </p>
      <p className="result-titlecard-label">あなたの駅力は？</p>
      <p className="result-titlecard">「{titleForScore(result.correctCount, result.totalQuestions)}」</p>
      <button type="button" className="btn btn--primary btn--large" onClick={onRestart}>
        もう一度遊ぶ
      </button>
    </div>
  );
}
