import { useEffect } from 'react';
import { TopScreen } from './components/TopScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { useGame } from './game/useGame';
import { captureUtmParams, trackEvent } from './utils/analytics';
import './App.css';

function App() {
  const game = useGame();

  useEffect(() => {
    captureUtmParams();
  }, []);

  const handleStart = () => {
    trackEvent('game_start');
    game.startGame();
  };

  const handleRestart = () => {
    trackEvent('game_replay');
    game.restart();
  };

  useEffect(() => {
    if (game.phase === 'result') {
      trackEvent('game_complete', {
        correctCount: game.result?.correctCount,
        totalScore: game.result?.totalScore,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.phase]);

  if (game.phase === 'top') {
    return <TopScreen onStart={handleStart} />;
  }

  if (game.phase === 'playing' && game.currentQuestion) {
    return (
      <QuizScreen
        question={game.currentQuestion}
        questionNumber={game.currentIndex + 1}
        totalQuestions={game.totalQuestions}
        selectedStationId={game.selectedStationId}
        answered={game.answered}
        lastAnswer={game.lastAnswer}
        onSelect={game.selectChoice}
        onSubmit={game.submitAnswer}
        onNext={game.nextQuestion}
      />
    );
  }

  if (game.phase === 'result' && game.result) {
    return <ResultScreen result={game.result} onRestart={handleRestart} />;
  }

  return null;
}

export default App;
