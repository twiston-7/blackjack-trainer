// Card types
export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
    suit: Suit;
    rank: Rank;
    faceDown?: boolean;
}

// Game action types
export type Action = 'hit' | 'stand' | 'double' | 'split';

// Game status types
export type GameStatus = 'waiting' | 'playing' | 'finished';

// Feedback types
export type FeedbackType = 'correct' | 'incorrect' | '';

// Hand types
export type HandType = 'hard' | 'soft' | 'pair';

// Game state interface
export interface GameState {
    dealerHand: Card[];
    playerHand: Card[];
    dealerTotal: number;
    playerTotal: number;
    deck: Card[];
    feedback: string;
    feedbackType: FeedbackType;
    gameStatus: GameStatus;
    correctMoves: number;
    totalMoves: number;
}

// Basic strategy matrix type
export interface StrategyMatrix {
    hard: { [key: number]: { [key: string]: Action } };
    soft: { [key: number]: { [key: string]: Action } };
    pairs: { [key: string]: { [key: string]: Action } };
}

export interface EngineSettings {
    numDecks: number;
    dealerSoft17: 'stand' | 'hit';
    doubleRules: 'any2' | '9-10-11' | '10-11';
    surrender: 'none' | 'early' | 'late';
    doubleAfterSplit: boolean;
    dealerPeeks: boolean;
}

export interface HandState {
    playerHand: Card[];
    dealerUpcard: Card;
    canDouble: boolean;
    canSplit: boolean;
    canSurrender: boolean;
}

export interface ExpectedValue {
    hit: number;
    stand: number;
    double: number;
    split: number;
    surrender: number;
}

export type OptimalAction = Action | 'surrender';

export interface StrategyResult {
    action: OptimalAction;
    expectedValue: number;
    allEVs: ExpectedValue;
}
