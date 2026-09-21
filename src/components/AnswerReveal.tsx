import type { Answer } from '../types';

interface AnswerRevealProps {
  answer: Answer;
  onNext: () => void;
  isLastQuestion: boolean;
}

export function AnswerReveal({ answer, onNext, isLastQuestion }: AnswerRevealProps) {
  return (
    <div className={`answer-reveal ${answer.correct ? 'is-correct' : 'is-incorrect'}`}>
      <p className="answer-reveal__headline">{answer.correct ? '正解！' : '残念！'}</p>
      <p className="answer-reveal__station">
        {answer.correct ? answer.question.station.displayName : `正解は「${answer.question.station.displayName}」`}
      </p>
      <p className="answer-reveal__points">+{answer.points}点</p>
      <button type="button" className="btn btn--primary btn--large" onClick={onNext}>
        {isLastQuestion ? '結果を見る' : '次の問題へ'}
      </button>
    </div>
  );
}
