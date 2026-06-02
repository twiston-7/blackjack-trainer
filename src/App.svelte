<script lang="ts">
    import { onMount } from 'svelte';
    import Controls from './components/Controls.svelte';
    import FeedbackMessage from './components/FeedbackMessage.svelte';
    import SettingsModal from './components/SettingsModal.svelte';
    import AppBackground from './components/AppBackground.svelte';
    import { gameState, startNewRound } from './stores/gameState';
    import type { RuleVariant } from './strategy';
    import HandPanel from "./components/HandPanel.svelte";

    let selectedVariant: RuleVariant = 's17';
    let settingsOpen = false;

    onMount(() => {
        startNewRound();
    });
</script>

<AppBackground />

<div class="container">
    <div class="header">
        <div class="title-row">
            <h1>Blackjack Strategy Trainer</h1>
            <button class="settings-btn" on:click={() => settingsOpen = true}>
                ⚙️
            </button>
        </div>
        <div class="stats">
            <span>Score: {$gameState.correctMoves}/{$gameState.totalMoves}</span>
            <span>
        Accuracy: {$gameState.totalMoves > 0
                ? Math.round(($gameState.correctMoves / $gameState.totalMoves) * 100)
                : 0}%
      </span>
        </div>
    </div>

    <main class="game-area">
        <HandPanel
                title="Dealer"
                cards={$gameState.dealerHand}
                total={$gameState.dealerTotal}
                panelClass="dealer"
        />

        <FeedbackMessage />

        <HandPanel
                title="Your Hand"
                cards={$gameState.playerHand}
                total={$gameState.playerTotal}
                panelClass="player"
        />
    </main>

    <Controls {selectedVariant} {startNewRound} />
</div>

<SettingsModal bind:isOpen={settingsOpen} bind:selectedVariant />

<style>
    .container {
        width: 100%;
        height: 100vh;
        max-width: 87.5rem;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        z-index: 1;
    }

    .header {
        flex-shrink: 0;
        padding: 1vh 2vw 0 2vw;
    }

    .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5vh;
    }

    h1 {
        font-size: clamp(1.8rem, 3.5vw, 2.8rem);
        margin: 0;
        color: white;
        text-shadow: 0.125rem 0.125rem 0.25rem rgba(0,0,0,0.5);
    }

    .settings-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 0.125rem solid white;
        border-radius: 50%;
        width: clamp(2.8rem, 5.5vh, 4rem);
        height: clamp(2.8rem, 5.5vh, 4rem);
        font-size: clamp(1.4rem, 2.8vh, 2rem);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .settings-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
    }

    .stats {
        display: flex;
        gap: 3vw;
        justify-content: center;
        margin-bottom: 0.5vh;
    }

    .stats span {
        color: white;
        font-size: clamp(1rem, 2vw, 1.4rem);
        font-weight: bold;
        text-shadow: 0.0625rem 0.0625rem 0.1875rem rgba(0,0,0,0.5);
    }

    .game-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 2vw;
        min-height: 0;
        overflow-y: auto;
    }
</style>
