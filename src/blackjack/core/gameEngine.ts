import type { Action } from '@app-types/Action';
import type { Card } from '@app-types/CardType';
import type { RuleVariant } from '@strategy/index';
import { getGameState, setGameState } from '@stores/gameState';
import { createDeck, dealCard, shuffleDeck } from '@core/deckManager';
import { calculateHandValue, canDouble, canSplit } from '@core/gameRules';
import { getCorrectAction } from '@core/strategyChecker';

function createStartingHands(deck: Card[]) {
    let currentDeck = deck;
    let playerHand: Card[] = [];
    let dealerHand: Card[] = [];
    let dealerUpcard: Card = currentDeck[0];

    do {
        const { card: playerCard1, remainingDeck: deck1 } = dealCard(currentDeck);
        const { card: dealerCard1, remainingDeck: deck2 } = dealCard(deck1);
        const { card: playerCard2, remainingDeck: deck3 } = dealCard(deck2);
        const { card: dealerCard2, remainingDeck: deck4 } = dealCard(deck3);

        currentDeck = deck4;
        playerHand = [playerCard1, playerCard2];
        dealerHand = [dealerCard1, { ...dealerCard2, faceDown: true }];
        dealerUpcard = dealerCard1;
    } while (calculateHandValue(playerHand) === 21);

    return {
        deck: currentDeck,
        playerHand,
        dealerHand,
        dealerUpcard,
    };
}

export function startNewRound(): void {
    const startingDeck = shuffleDeck(createDeck());
    const { deck, playerHand, dealerHand, dealerUpcard } = createStartingHands(startingDeck);

    setGameState((current) => ({
        ...current,
        deck,
        playerHand,
        dealerHand,
        playerTotal: calculateHandValue(playerHand),
        dealerTotal: calculateHandValue([dealerUpcard]),
        gameStatus: 'playing',
        feedback: '',
        feedbackType: '',
    }));
}

export function getActionButtonState() {
    const state = getGameState();
    const isPlaying = state.gameStatus === 'playing';

    return {
        canAct: isPlaying,
        canDouble: isPlaying && canDouble(state.playerHand),
        canSplit: isPlaying && canSplit(state.playerHand),
    };
}

export function submitPlayerAction(action: Action, selectedVariant: RuleVariant): void {
    const current = getGameState();

    if (
        current.gameStatus !== 'playing' ||
        current.playerHand.length === 0 ||
        current.dealerHand.length === 0
    ) {
        return;
    }

    const correctAction = getCorrectAction(current.playerHand, current.dealerHand[0], selectedVariant);

    if (action === correctAction) {
        setGameState((state) => ({
            ...state,
            feedback: `✓ Correct! ${action.toUpperCase()}`,
            feedbackType: 'correct',
            correctMoves: state.correctMoves + 1,
            totalMoves: state.totalMoves + 1,
        }));
    } else {
        setGameState((state) => ({
            ...state,
            feedback: `✗ Wrong. Should be ${correctAction.toUpperCase()}`,
            feedbackType: 'incorrect',
            totalMoves: state.totalMoves + 1,
        }));
    }

    window.setTimeout(() => {
        startNewRound();
    }, 1800);
}
