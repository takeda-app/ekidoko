import { useCallback, useMemo, useState } from 'react';
import { stations } from '../data/stations';
import { pickRandom, shuffle } from '../utils/shuffle';
import { pointsForAnswer } from '../utils/scoring';
import type { Answer, GamePhase, GameResult, Question, Station } from '../types';

const QUESTIONS_PER_GAME = 5;
const CHOICES_PER_QUESTION = 4;

function buildQuestions(): Question[] {
  const targetStations = pickRandom(stations, QUESTIONS_PER_GAME);
  return targetStations.map((station) => {
    const decoys = pickRandom(
      stations.filter((s) => s.id !== station.id),
      CHOICES_PER_QUESTION - 1,
    );
    return {
      station,
      choices: shuffle([station, ...decoys]),
    };
  });
}

interface GameState {
  phase: GamePhase;
  questions: Question[];
  currentIndex: number;
  selectedStationId: string | null;
  answered: boolean;
  answers: Answer[];
}

const initialState: GameState = {
  phase: 'top',
  questions: [],
  currentIndex: 0,
  selectedStationId: null,
  answered: false,
  answers: [],
};

export function useGame() {
  const [state, setState] = useState<GameState>(initialState);

  const startGame = useCallback(() => {
    setState({
      phase: 'playing',
      questions: buildQuestions(),
      currentIndex: 0,
      selectedStationId: null,
      answered: false,
      answers: [],
    });
  }, []);

  const selectChoice = useCallback((station: Station) => {
    setState((prev) => (prev.answered ? prev : { ...prev, selectedStationId: station.id }));
  }, []);

  const submitAnswer = useCallback(() => {
    setState((prev) => {
      if (prev.answered || !prev.selectedStationId) return prev;
      const question = prev.questions[prev.currentIndex];
      const correct = prev.selectedStationId === question.station.id;
      const answer: Answer = {
        question,
        selectedStationId: prev.selectedStationId,
        correct,
        points: pointsForAnswer(correct),
      };
      return { ...prev, answered: true, answers: [...prev.answers, answer] };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const isLastQuestion = prev.currentIndex + 1 >= prev.questions.length;
      if (isLastQuestion) {
        return { ...prev, phase: 'result' };
      }
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedStationId: null,
        answered: false,
      };
    });
  }, []);

  const restart = useCallback(() => {
    setState(initialState);
  }, []);

  const result: GameResult | null = useMemo(() => {
    if (state.phase !== 'result') return null;
    const correctCount = state.answers.filter((a) => a.correct).length;
    const totalScore = state.answers.reduce((sum, a) => sum + a.points, 0);
    return {
      answers: state.answers,
      correctCount,
      totalScore,
      totalQuestions: state.questions.length,
    };
  }, [state.phase, state.answers, state.questions.length]);

  const currentQuestion = state.questions[state.currentIndex] ?? null;
  const lastAnswer = state.answered ? state.answers[state.answers.length - 1] : null;

  return {
    phase: state.phase,
    currentQuestion,
    currentIndex: state.currentIndex,
    totalQuestions: state.questions.length,
    selectedStationId: state.selectedStationId,
    answered: state.answered,
    lastAnswer,
    result,
    startGame,
    selectChoice,
    submitAnswer,
    nextQuestion,
    restart,
  };
}
