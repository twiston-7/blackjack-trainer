import type { Card, Suit, Rank } from '../types';

const suits: Suit[] = ['♠', '♥', '♦', '♣'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }
    return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function dealCard(deck: Card[]): { card: Card; remainingDeck: Card[] } {
    const card = deck[0];
    const remainingDeck = deck.slice(1);
    return { card, remainingDeck };
}

export function getCardValue(rank: Rank): number {
    if (rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank);
}

export function normalizeRank(rank: Rank): string {
    // Normalize face cards to '10' for pair checking
    if (['10', 'J', 'Q', 'K'].includes(rank)) return '10';
    return rank;
}
