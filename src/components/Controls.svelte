<script lang="ts">
    import { gameState, updateFeedback, incrementCorrectMoves, incrementTotalMoves } from '../stores/gameState';
    import { getCorrectAction } from '../logic/strategyChecker';
    import type { Action } from '../types';
    import type { RuleVariant } from '../strategy';
    import { canDouble, canSplit } from '../logic/gameRules';

    export let selectedVariant: RuleVariant;
    export let startNewRound: () => void;

    function handleAction(action: Action) {
        const state = $gameState;

        if (state.gameStatus !== 'playing' || state.playerHand.length === 0 || state.dealerHand.length === 0) {
            return;
        }

        const correctAction = getCorrectAction(state.playerHand, state.dealerHand[0], selectedVariant);

        if (action === correctAction) {
            updateFeedback(`✓ Correct! ${action.toUpperCase()}`, 'correct');
            incrementCorrectMoves();
        } else {
            updateFeedback(`✗ Wrong. Should be ${correctAction.toUpperCase()}`, 'incorrect');
            incrementTotalMoves();
        }

        setTimeout(() => {
            startNewRound();
        }, 1800);
    }

    $: doubleEnabled = $gameState.gameStatus === 'playing' && canDouble($gameState.playerHand);
    $: splitEnabled = $gameState.gameStatus === 'playing' && canSplit($gameState.playerHand);
</script>

<div class="controls">
    <button on:click={() => handleAction('hit')} disabled={$gameState.gameStatus !== 'playing'}>Hit</button>
    <button on:click={() => handleAction('stand')} disabled={$gameState.gameStatus !== 'playing'}>Stand</button>
    <button on:click={() => handleAction('double')} disabled={!doubleEnabled}>Double</button>
    <button on:click={() => handleAction('split')} disabled={!splitEnabled}>Split</button>
    <button on:click={startNewRound} class="new-game">Skip</button>
</div>

<style>
    .controls {
        position: sticky;
        bottom: 0;
        display: flex;
        gap: 1.2vw;
        justify-content: center;
        padding: 2vh 2vw;
        flex-shrink: 0;
        z-index: 100;
    }

    button {
        padding: 1.8vh 2.8vw;
        font-size: clamp(0.95rem, 1.9vh, 1.25rem);
        border: none;
        border-radius: 8px;
        background: #4CAF50;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        min-width: clamp(75px, 11vw, 110px);
        flex-shrink: 0;
    }

    button:hover:not(:disabled) {
        background: #45a049;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.4);
    }

    button:active:not(:disabled) {
        transform: translateY(0);
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    .new-game {
        background: #2196F3;
    }

    .new-game:hover:not(:disabled) {
        background: #0b7dda;
    }

    @media (max-width: 900px) {
        .controls {
            gap: 1vw;
        }

        button {
            min-width: clamp(65px, 10vw, 95px);
            padding: 1.5vh 2.2vw;
            font-size: clamp(0.85rem, 1.7vh, 1.1rem);
        }
    }
</style>
