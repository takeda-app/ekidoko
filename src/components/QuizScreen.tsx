import { AnswerReveal } from './AnswerReveal';
import { StationMap } from './StationMap';
import type { Answer, Question, Station } from '../types';

interface QuizScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedStationId: string | null;
  answered: boolean;
  lastAnswer: Answer | null;
  onSelect: (station: Station) => void;
  onSubmit: () => void;
  onNext: () => void;
}

export function QuizScreen({
  question,
  questionNumber,
  totalQuestions,
  selectedStationId,
  answered,
  lastAnswer,
  onSelect,
  onSubmit,
  onNext,
}: QuizScreenProps) {
  return (
    <div className="screen screen--quiz">
      <div className="quiz-header">
        <span className="quiz-progress">
          第{questionNumber}問 / {totalQuestions}問
        </span>
        <span className="quiz-question-text">この場所にある駅はどこ？</span>
      </div>

      <div className="quiz-map-area">
        <StationMap station={question.station} revealed={answered} />
      </div>

      {answered && lastAnswer ? (
        <AnswerReveal
          answer={lastAnswer}
          onNext={onNext}
          isLastQuestion={questionNumber >= totalQuestions}
        />
      ) : (
        <div className="quiz-choices-area">
          <div className="quiz-choices">
            {question.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={`choice-btn ${selectedStationId === choice.id ? 'is-selected' : ''}`}
                onClick={() => onSelect(choice)}
              >
                {choice.displayName}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn--primary btn--large"
            disabled={!selectedStationId}
            onClick={onSubmit}
          >
            回答する
          </button>
        </div>
      )}
    </div>
  );
}
