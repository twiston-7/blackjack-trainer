import type { Action, Card } from '../../types';
import { getStrategy, type RuleVariant } from '../../strategy';
import { normalizeRank } from './deckManager';
import { calculateHandValue, getDealerUpcardValue, getHandType } from './gameRules';

export function getCorrectAction(
    playerHand: Card[],
    dealerUpcard: Card,
    variant: RuleVariant = 's17'
): Action {
    const strategy = getStrategy(variant);
    const handType = getHandType(playerHand);
    const dealerValue = getDealerUpcardValue(dealerUpcard);

    let key: string;

    if (handType === 'pair') {
        const rank = normalizeRank(playerHand[0].rank);
        key = `${rank},${rank}`;

        if (strategy.pairs[key] && strategy.pairs[key][dealerValue]) {
            return strategy.pairs[key][dealerValue];
        }
    }

    if (handType === 'soft') {
        const total = calculateHandValue(playerHand).toString();

        if (strategy.soft[total] && strategy.soft[total][dealerValue]) {
            return strategy.soft[total][dealerValue];
        }
    }

    const total = calculateHandValue(playerHand).toString();

    if (strategy.hard[total] && strategy.hard[total][dealerValue]) {
        return strategy.hard[total][dealerValue];
    }

    const numTotal = calculateHandValue(playerHand);
    return numTotal >= 17 ? 'stand' : 'hit';
}

export function checkPlayerAction(
    playerAction: Action,
    playerHand: Card[],
    dealerUpcard: Card,
    variant: RuleVariant = 's17'
): boolean {
    const correctAction = getCorrectAction(playerHand, dealerUpcard, variant);
    return playerAction === correctAction;
}
