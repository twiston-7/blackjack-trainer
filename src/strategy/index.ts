import type { Action } from '../types';
import s17Strategy from './s17-strategy.json';
import h17Strategy from './h17-strategy.json';
import enhcStrategy from './enhc-strategy.json';

export type RuleVariant = 's17' | 'h17' | 'enhc';

interface StrategyData {
    hard: Record<string, Record<string, Action>>;
    soft: Record<string, Record<string, Action>>;
    pairs: Record<string, Record<string, Action>>;
}

const strategies: Record<RuleVariant, StrategyData> = {
    s17: s17Strategy as StrategyData,
    h17: h17Strategy as StrategyData,
    enhc: enhcStrategy as StrategyData
};

export function getStrategy(variant: RuleVariant): StrategyData {
    return strategies[variant];
}

export { s17Strategy, h17Strategy, enhcStrategy };
