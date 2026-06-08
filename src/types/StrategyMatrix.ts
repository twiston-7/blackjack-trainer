import type { Action } from '@app-types/Action';

export interface StrategyMatrix {
    hard: { [key: number]: { [key: string]: Action } };
    soft: { [key: number]: { [key: string]: Action } };
    pairs: { [key: string]: { [key: string]: Action } };
}