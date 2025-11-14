<script lang="ts">
    import SettingsTab from './SettingsTab.svelte';
    import { settings } from '../../stores/settingsStore';
</script>

<SettingsTab>
    <label>
        <span class="label-text">Background Mode:</span>
        <select bind:value={$settings.backgroundMode}>
            <option value="webgl">Dynamic (WebGL)</option>
            <option value="video">Video</option>
            <option value="static">Static Color</option>
        </select>
    </label>

    {#if $settings.backgroundMode === 'static'}
        <label>
            <span class="label-text">Background Color:</span>
            <input type="color" bind:value={$settings.staticColor}>
        </label>
    {/if}

    {#if $settings.backgroundMode === 'webgl'}
        <label>
            <span class="label-text">Max Frame Rate (FPS):</span>
            <input type="number" min="1" max="120" bind:value={$settings.fpsCap}>
        </label>
    {/if}
</SettingsTab>

<style>
    label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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

    input[type="color"] {
        padding: 0.25rem;
        height: 40px;
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 4px;
        cursor: pointer;
    }

    input[type="color"]:focus {
        outline: none;
        border-color: #4CAF50;
    }

    input[type="number"] {
        padding: 0.5rem;
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 4px;
        color: #fff;
        font-size: 1rem;
    }

    input[type="number"]:focus {
        outline: none;
        border-color: #4CAF50;
    }
</style>
