<script lang="ts">
    import { onMount } from 'svelte';
    import Dealer from './components/Dealer.svelte';
    import Player from './components/Player.svelte';
    import Controls from './components/Controls.svelte';
    import FeedbackMessage from './components/FeedbackMessage.svelte';
    import SettingsModal from './components/SettingsModal.svelte';
    import AppBackground from './components/AppBackground.svelte';
    import { gameState, resetGame } from './stores/gameState';
    import { dealCard } from './logic/deckManager';
    import { calculateHandValue } from './logic/gameRules';
    import type {Card, Rank, Suit} from './types'
    import type { RuleVariant } from './strategy';

    let selectedVariant: RuleVariant = 's17';
    let settingsOpen = false;

    onMount(() => {
        startNewRound();
    });

    function startNewRound() {
        resetGame();

        gameState.update(state => {
            let deck = state.deck;
            let playerHand;
            let dealerHand;
            let dealerUpcard: Card = { suit: '♠' as Suit, rank: '2' as Rank };
            let endDeck;

            while (playerHand == null || calculateHandValue(playerHand) === 21) {
                resetGame();
                const { card: playerCard1, remainingDeck: deck1 } = dealCard(deck);
                const { card: dealerCard1, remainingDeck: deck2 } = dealCard(deck1);
                const { card: playerCard2, remainingDeck: deck3 } = dealCard(deck2);
                const { card: dealerCard2, remainingDeck: deck4 } = dealCard(deck3);
                endDeck = deck4

                playerHand = [playerCard1, playerCard2];
                dealerHand = [dealerCard1, { ...dealerCard2, faceDown: true }];
                dealerUpcard = dealerCard1;
            }

            return {
                ...state,
                deck: endDeck,
                playerHand,
                dealerHand,
                playerTotal: calculateHandValue(playerHand),
                dealerTotal: calculateHandValue([dealerUpcard]),
                gameStatus: 'playing',
                feedback: '',
                feedbackType: ''
            };
        });
    }
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
        <Dealer />
        <FeedbackMessage />
        <Player />
    </main>

    <Controls {selectedVariant} {startNewRound} />
</div>

<SettingsModal bind:isOpen={settingsOpen} bind:selectedVariant />

<style>
    .container {
        width: 100%;
        height: 100vh;
        max-width: 1400px;
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
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }

    .settings-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid white;
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
        text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
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
