import { writable } from 'svelte/store';
import type { Card, GameState, FeedbackType } from '../types';
import { calculateHandValue } from '../logic/gameRules';
import { createDeck, dealCard, shuffleDeck } from '../logic/deckManager';

const initialState: GameState = {
    dealerHand: [],
    playerHand: [],
    dealerTotal: 0,
    playerTotal: 0,
    deck: [],
    feedback: '',
    feedbackType: '',
    gameStatus: 'waiting',
    correctMoves: 0,
    totalMoves: 0
};

export const gameState = writable<GameState>(initialState);

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
        dealerUpcard
    };
}


export function startNewRound(): void {
    const startingDeck = shuffleDeck(createDeck());
    const { deck, playerHand, dealerHand, dealerUpcard } = createStartingHands(startingDeck);

    gameState.update(state => ({
        ...state,
        deck,
        playerHand,
        dealerHand,
        playerTotal: calculateHandValue(playerHand),
        dealerTotal: calculateHandValue([dealerUpcard]),
        gameStatus: 'playing',
        feedback: '',
        feedbackType: ''
    }));
}

export function updateFeedback(message: string, type: FeedbackType): void {
    gameState.update(state => ({
        ...state,
        feedback: message,
        feedbackType: type
    }));
}
export function incrementCorrectMoves(): void {
    gameState.update(state => ({
        ...state,
        correctMoves: state.correctMoves + 1,
        totalMoves: state.totalMoves + 1
    }));
}

export function incrementTotalMoves(): void {
    gameState.update(state => ({
        ...state,
        totalMoves: state.totalMoves + 1
    }));
}
