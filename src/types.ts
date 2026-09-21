export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Station {
  id: string;
  name: string;
  displayName: string;
  prefecture: string;
  latitude: number;
  longitude: number;
  difficulty: Difficulty;
}

export interface Question {
  station: Station;
  choices: Station[];
}

export interface Answer {
  question: Question;
  selectedStationId: string | null;
  correct: boolean;
  points: number;
}

export type GamePhase = 'top' | 'playing' | 'result';

export interface GameResult {
  answers: Answer[];
  correctCount: number;
  totalScore: number;
  totalQuestions: number;
}
