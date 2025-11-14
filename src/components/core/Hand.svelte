<script lang="ts">
    import Card from './Card.svelte';
    import type { Card as CardType } from '../../types';

    export let cards: CardType[] = [];
    export let showTotal: boolean = true;
    export let total: number = 0;
</script>

<div class="hand">
    <div class="cards">
        {#each cards as card}
            <Card suit={card.suit} rank={card.rank} faceDown={card.faceDown || false} />
        {/each}
    </div>

    {#if showTotal}
        <div class="total">Total: {total}</div>
    {/if}
</div>

<style>
    .hand {
        position: relative;
    }

    .cards {
        display: flex;
        justify-content: center;
        gap: 1vw;
        margin-bottom: 0.5vh;
        flex-wrap: wrap;
    }

    .total {
        position: absolute;
        bottom: 0.5vh;
        right: 1.5vw;
        font-size: clamp(1rem, 2.2vh, 1.5rem);
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
    }
</style>
