<script lang="ts">
    import SettingsTab from './SettingsTab.svelte';
    import { settings } from '../../stores/settingsStore';
    import type { RuleVariant } from '../../strategy';

    export let selectedVariant: RuleVariant;
</script>

<SettingsTab>
    <label>
        <span class="label-text">Blackjack Rules:</span>
        <select bind:value={selectedVariant}>
            <option value="s17">S17 - Dealer Stands on Soft 17</option>
            <option value="h17">H17 - Dealer Hits on Soft 17</option>
            <option value="enhc">ENHC - European No Hole Card</option>
        </select>
    </label>

    <label>
        <span class="label-text">Number of decks:</span>
        <select bind:value={$settings.numDecks}>
            <option value={1}>1 deck</option>
            <option value={2}>2 decks</option>
            <option value={4}>4 decks</option>
            <option value={6}>6 decks</option>
            <option value={8}>8 decks</option>
        </select>
    </label>

    <label>
        <span class="label-text">Dealer soft 17:</span>
        <select bind:value={$settings.dealerSoft17}>
            <option value="stand">Dealer stands on soft 17</option>
            <option value="hit">Dealer hits soft 17</option>
        </select>
    </label>

    <label>
        <span class="label-text">Permitted doubles:</span>
        <select bind:value={$settings.doubleRules}>
            <option value="any2">Double on any 2 cards</option>
            <option value="9-10-11">Double on 9, 10, or 11 only</option>
            <option value="10-11">Double on 10 or 11 only</option>
        </select>
    </label>

    <label>
        <span class="label-text">Surrender:</span>
        <select bind:value={$settings.surrender}>
            <option value="none">No surrender</option>
            <option value="early">Early surrender</option>
            <option value="late">Late surrender</option>
        </select>
    </label>

    <label class="checkbox-label">
        <input type="checkbox" bind:checked={$settings.doubleAfterSplit}>
        <span class="label-text">Double after split allowed</span>
    </label>

    <label class="checkbox-label">
        <input type="checkbox" bind:checked={$settings.dealerPeeks}>
        <span class="label-text">Dealer peeks for blackjack</span>
    </label>
</SettingsTab>

<style>
    label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .checkbox-label {
        flex-direction: row;
        align-items: center;
    }

    .checkbox-label input {
        width: auto;
        margin-right: 0.5rem;
    }

    .label-text {
        color: #fff;
        font-weight: 500;
    }

    select {
        padding: 0.5rem;
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 4px;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
    }

    select:focus {
        outline: none;
        border-color: #4CAF50;
    }

    input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
</style>
