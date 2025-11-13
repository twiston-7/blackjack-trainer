<script lang="ts">
    import { gameState } from '../stores/gameState';
    import { fade } from 'svelte/transition';
</script>

<div class="feedback-container">
    {#if $gameState.feedback}
        <div
                class="feedback"
                class:correct={$gameState.feedbackType === 'correct'}
                class:incorrect={$gameState.feedbackType === 'incorrect'}
                transition:fade
        >
            {$gameState.feedback}
        </div>
    {/if}
</div>

<style>
    .feedback-container {
        position: relative;
        min-height: 4vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.5vh 0;
    }

    .feedback {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 1.2vh 2.5vw;
        border-radius: 8px;
        font-size: clamp(1rem, 2.2vh, 1.4rem);
        font-weight: bold;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        z-index: 10;
    }

    .correct {
        background: #4CAF50;
        color: white;
    }

    .incorrect {
        background: #f44336;
        color: white;
    }
</style>
