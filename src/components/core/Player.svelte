<script lang="ts">
    import Hand from './Hand.svelte';
    import { gameState } from '../../stores/gameState';
</script>

<div class="player">
    <h2>Your Hand</h2>
    <Hand cards={$gameState.playerHand} total={$gameState.playerTotal} />
</div>

<style>
    .player {
        background: rgba(0, 0, 0, 0.2);
        padding: 2vh 2vw;
        border-radius: 12px;
        backdrop-filter: blur(5px);
        position: relative;
    }

    h2 {
        margin: 0 0 1.5vh 0;
        font-size: clamp(1.2rem, 2.5vh, 1.8rem);
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        text-align: center;
    }
</style>
