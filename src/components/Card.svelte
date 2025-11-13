<script lang="ts">
    import type { Suit, Rank } from '../types';
    import { getPipCount, calculatePipPositions, getPipSizeForSuit } from '../utils/cardPips';

    export let suit: Suit = '♠';
    export let rank: Rank = 'A';
    export let faceDown: boolean = false;

    $: isFaceCard = ['J', 'Q', 'K'].includes(rank);
    $: pipCount = getPipCount(rank);
    $: pipPositions = calculatePipPositions(pipCount);
    $: pipSize = getPipSizeForSuit(suit, rank);
    $: isTen = rank === '10';
</script>

<div class="card" class:face-down={faceDown}>
    {#if !faceDown}
        <div class="card-content" class:red={suit === '♥' || suit === '♦'}>
            <div class="corner top-left" class:ten={isTen}>
                <div class="rank">{rank}</div>
                <div class="suit-small">{suit}</div>
            </div>

            {#if isFaceCard}
                <div class="face-card">
                    <img src={`/cards/${rank.toLowerCase()}.png`} alt={`${rank} of ${suit}`} />
                </div>
            {:else}
                <div class="pips">
                    {#each pipPositions as position}
                        <div
                                class="pip"
                                style="top: {position.top}%; left: {position.left}%; font-size: {pipSize}; transform: translate(-50%, -50%) rotate({position.rotate || 0}deg);"
                        >
                            {suit}
                        </div>
                    {/each}
                </div>
            {/if}

            <div class="corner bottom-right" class:ten={isTen}>
                <div class="rank">{rank}</div>
                <div class="suit-small">{suit}</div>
            </div>
        </div>
    {:else}
        <div class="card-back"></div>
    {/if}
</div>

<style>
    .card {
        width: clamp(135px, 15vw, 195px);
        aspect-ratio: 5 / 7;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: white;
        display: inline-block;
        margin: 0 0.6vw;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        transition: transform 0.3s ease;
        flex-shrink: 0;
        position: relative;
        font-size: clamp(13.5px, 1.5vw, 19.5px);
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }

    .card-content {
        position: relative;
        height: 100%;
        width: 100%;
        color: #000;
        padding: 0;
        overflow: hidden;
    }

    .card-content.red {
        color: #d32f2f;
    }

    .corner {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 0.9;
        z-index: 10;
    }

    .top-left {
        top: 2.5%;
        left: 3%;
    }

    /* Special positioning for 10s - pushed more into corner */
    .top-left.ten {
        top: 1.5%;
        left: 1.5%;
    }

    .bottom-right {
        bottom: 2.5%;
        right: 3%;
        transform: rotate(180deg);
    }

    .bottom-right.ten {
        bottom: 1.5%;
        right: 1.5%;
    }

    .rank {
        font-size: 1.8em;
        font-weight: bold;
        font-family: 'Arial', sans-serif;
        letter-spacing: -0.08em;
    }

    .suit-small {
        font-size: 1.4em;
        margin-top: -0.1em;
    }

    .pips {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .pip {
        position: absolute;
        line-height: 1;
    }

    .face-card {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        height: 75%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .face-card img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .card-back {
        height: 100%;
        background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .card-back::before {
        content: '';
        position: absolute;
        width: 80%;
        height: 85%;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 4px;
    }
</style>
