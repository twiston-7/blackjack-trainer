import type { Rank } from '@app-types/Rank';
import type { Suit } from '@app-types/Suit';

export interface Card {
    suit: Suit;
    rank: Rank;
    faceDown?: boolean;
}