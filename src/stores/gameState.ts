import { useSyncExternalStore } from 'react';
import type { GameState } from '../types';

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
    totalMoves: 0,
};

let state: GameState = initialState;
const listeners = new Set<() => void>();

function emitChange() {
    for (const listener of listeners) {
        listener();
    }
}

export function setGameState(updater: (current: GameState) => GameState) {
    state = updater(state);
    emitChange();
}

export function getGameState(): GameState {
    return state;
}

export function subscribeGameState(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function useGameState(): GameState {
    return useSyncExternalStore(subscribeGameState, getGameState, getGameState);
}
