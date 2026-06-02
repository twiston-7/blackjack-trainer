<script lang="ts">
    import Hand from './Hand.svelte';
    import type { Card as CardType } from '../types';

    export let title: string;
    export let cards: CardType[] = [];
    export let total: number = 0;
    export let showTotal: boolean = true;
    export let panelClass: string = '';
</script>

<div class="hand-panel" class:dealer={panelClass === 'dealer'}>
    <h2>{title}</h2>
    <Hand {cards} {total} {showTotal} />
</div>

<style>
    .hand-panel {
        background: rgba(0, 0, 0, 0.2);
        padding: 2vh 2vw;
        border-radius: 0.75rem;
        backdrop-filter: blur(0.3125rem);
        position: relative;
    }

    .hand-panel.dealer {
        background: rgba(255, 255, 255, 0.05);
    }

    h2 {
        margin: 0 0 1.5vh 0;
        font-size: clamp(1.2rem, 2.5vh, 1.8rem);
        color: white;
        text-shadow: 0.0625rem 0.0625rem 0.125rem rgba(0, 0, 0, 0.5);
        text-align: center;
    }
</style>

