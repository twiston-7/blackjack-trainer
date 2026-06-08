import type { Card } from '@app-types/CardType';
import { getCardValue, normalizeRank } from '@core/deckManager';

export function calculateHandValue(cards: Card[]): number {
    let total = 0;
    let aces = 0;

    for (const card of cards) {
        const value = getCardValue(card.rank);
        total += value;
        if (card.rank === 'A') aces++;
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

export function isSoft(cards: Card[]): boolean {
    let total = 0;
    let hasAce = false;

    for (const card of cards) {
        const value = getCardValue(card.rank);
        total += value;
        if (card.rank === 'A') hasAce = true;
    }

    return hasAce && total <= 21;
}

export function isPair(cards: Card[]): boolean {
    if (cards.length !== 2) return false;
    return normalizeRank(cards[0].rank) === normalizeRank(cards[1].rank);
}

export function canDouble(hand: Card[]): boolean {
    return hand.length === 2;
}

export function canSplit(hand: Card[]): boolean {
    return isPair(hand);
}

export function isBusted(total: number): boolean {
    return total > 21;
}

export function getHandType(cards: Card[]): 'pair' | 'soft' | 'hard' {
    if (isPair(cards)) return 'pair';
    if (isSoft(cards)) return 'soft';
    return 'hard';
}

export function getDealerUpcardValue(card: Card): string {
    if (['J', 'Q', 'K'].includes(card.rank)) return '10';
    return card.rank;
}
