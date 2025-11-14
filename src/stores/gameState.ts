import { writable } from 'svelte/store';
import type { GameState, FeedbackType } from '../types';
import { createMultipleDecks, shuffleDeck, getDeckCountFromSettings } from '../logic/deckManager';

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

export function resetGame(): void {
    const deckCount = getDeckCountFromSettings();
    const deck = shuffleDeck(createMultipleDecks(deckCount));
    gameState.update(state => ({
        ...initialState,
        deck,
        correctMoves: state.correctMoves,
        totalMoves: state.totalMoves
    }));
}

export function updateFeedback(message: string, type: FeedbackType): void {
    gameState.update(state => ({
        ...state,
        feedback: message,
        feedbackType: type
    }));
}

export function clearFeedback(): void {
    gameState.update(state => ({
        ...state,
        feedback: '',
        feedbackType: ''
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
