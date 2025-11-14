import type { Rank, Suit } from '../types';

export interface PipPosition {
    top: number;
    left: number;
    rotate?: number;
}

export function getPipCount(rank: Rank): number {
    if (rank === 'A') return 1;
    if (['J', 'Q', 'K'].includes(rank)) return 0;
    const n = parseInt(rank);
    return isNaN(n) ? 0 : n;
}

export function getPipSizeForSuit(suit: Suit, rank: Rank): string {
    if (rank === 'A') {
        switch (suit) {
            case '♠':
            case '♣':
                return '6.5em';
            case '♥':
            case '♦':
                return '7.5em';
            default:
                return '7.0em';
        }
    }

    if (rank === '10') {
        switch (suit) {
            case '♠':
            case '♣':
                return '2.8em';
            case '♥':
            case '♦':
                return '3.2em';
            default:
                return '3.0em';
        }
    }

    switch (suit) {
        case '♠':
        case '♣':
            return '3.2em';
        case '♥':
        case '♦':
            return '3.7em';
        default:
            return '3.4em';
    }
}

export function calculatePipPositions(count: number): PipPosition[] {
    const pips: PipPosition[] = [];

    switch (count) {
        case 1:
            pips.push({ top: 50, left: 50 });
            break;
        case 2:
            pips.push({ top: 18, left: 50 });
            pips.push({ top: 82, left: 50, rotate: 180 });
            break;
        case 3:
            pips.push({ top: 18, left: 50 });
            pips.push({ top: 50, left: 50 });
            pips.push({ top: 82, left: 50, rotate: 180 });
            break;
        case 4:
            pips.push({ top: 17, left: 30 });
            pips.push({ top: 17, left: 70 });
            pips.push({ top: 83, left: 30, rotate: 180 });
            pips.push({ top: 83, left: 70, rotate: 180 });
            break;
        case 5:
            pips.push({ top: 17, left: 30 });
            pips.push({ top: 17, left: 70 });
            pips.push({ top: 50, left: 50 });
            pips.push({ top: 83, left: 30, rotate: 180 });
            pips.push({ top: 83, left: 70, rotate: 180 });
            break;
        case 6:
            pips.push({ top: 16, left: 30 });
            pips.push({ top: 16, left: 70 });
            pips.push({ top: 50, left: 30 });
            pips.push({ top: 50, left: 70 });
            pips.push({ top: 84, left: 30, rotate: 180 });
            pips.push({ top: 84, left: 70, rotate: 180 });
            break;
        case 7:
            pips.push({ top: 16, left: 30 });
            pips.push({ top: 16, left: 70 });
            pips.push({ top: 34, left: 50 });
            pips.push({ top: 50, left: 30 });
            pips.push({ top: 50, left: 70 });
            pips.push({ top: 84, left: 30, rotate: 180 });
            pips.push({ top: 84, left: 70, rotate: 180 });
            break;
        case 8:
            pips.push({ top: 16, left: 30 });
            pips.push({ top: 16, left: 70 });
            pips.push({ top: 34, left: 50 });
            pips.push({ top: 50, left: 30 });
            pips.push({ top: 50, left: 70 });
            pips.push({ top: 66, left: 50, rotate: 180 });
            pips.push({ top: 84, left: 30, rotate: 180 });
            pips.push({ top: 84, left: 70, rotate: 180 });
            break;
        case 9:
            pips.push({ top: 15, left: 30 });
            pips.push({ top: 15, left: 70 });
            pips.push({ top: 36, left: 30 });
            pips.push({ top: 36, left: 70 });
            pips.push({ top: 50, left: 50 });
            pips.push({ top: 64, left: 30, rotate: 180 });
            pips.push({ top: 64, left: 70, rotate: 180 });
            pips.push({ top: 85, left: 30, rotate: 180 });
            pips.push({ top: 85, left: 70, rotate: 180 });
            break;
        case 10:

            pips.push({ top: 13, left: 30 });
            pips.push({ top: 13, left: 70 });
            pips.push({ top: 28, left: 50 });
            pips.push({ top: 38, left: 30 });
            pips.push({ top: 38, left: 70 });
            pips.push({ top: 62, left: 30, rotate: 180 });
            pips.push({ top: 62, left: 70, rotate: 180 });
            pips.push({ top: 72, left: 50, rotate: 180 });
            pips.push({ top: 87, left: 30, rotate: 180 });
            pips.push({ top: 87, left: 70, rotate: 180 });
            break;
    }

    return pips;
}