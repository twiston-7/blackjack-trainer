import type { Card } from '@app-types/CardType';
import type { FeedbackType } from '@app-types/FeedbackType';
import type { GameStatus } from '@app-types/GameStatus';

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