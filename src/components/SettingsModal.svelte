<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import type { RuleVariant } from '../strategy';

    export let isOpen = false;
    export let selectedVariant: RuleVariant;

    const dispatch = createEventDispatcher();

    let backgroundMode: 'webgl' | 'static' = 'static';
    let staticColor = '#d9d9d9';
    let fpsCap = 30;

    let initialized = false; // prevents saving during load

    const rulesSelectId = 'blackjack-rules-select';
    const backgroundModeSelectId = 'background-mode-select';
    const staticColorId = 'background-color-input';
    const fpsCapId = 'fps-cap-input';

    function closeModal() {
        isOpen = false;
    }

    function handleBackdropKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            closeModal();
        }
    }

    function saveSettings() {
        if (!initialized) return; // don't save during load
        const settings = {
            backgroundMode,
            staticColor,
            fpsCap,
            rules: selectedVariant
        };
        localStorage.setItem('userSettings', JSON.stringify(settings));
        dispatch('userSettingsUpdated', settings);
        window.dispatchEvent(new Event('userSettingsUpdated'));
    }

    function loadSettings() {
        const saved = localStorage.getItem('userSettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            backgroundMode = parsed.backgroundMode === 'webgl' ? 'webgl' : 'static';
            staticColor = parsed.staticColor ?? staticColor;
            fpsCap = parsed.fpsCap ?? fpsCap;
            selectedVariant = parsed.rules ?? selectedVariant;
        } else {
            backgroundMode = 'static';
        }
        initialized = true;
    }

    onMount(loadSettings);

    // Only save when user actually changes a setting
    function onChange() {
        saveSettings();
    }
</script>

{#if isOpen}
    <div
        class="modal-backdrop"
        role="button"
        tabindex="0"
        aria-label="Close settings dialog"
        on:click={(e) => e.target === e.currentTarget && closeModal()}
        on:keydown={handleBackdropKeydown}
    >
        <div class="modal">
            <div class="modal-header">
                <h2>Settings</h2>
                <button type="button" class="close-btn" on:click={closeModal}>&times;</button>
            </div>

            <div class="modal-body">
                <div class="setting-group">
                    <label for={rulesSelectId}>Blackjack Rules:</label>
                    <select id={rulesSelectId} bind:value={selectedVariant} on:change={onChange}>
                        <option value="s17">S17 - Dealer Stands on Soft 17</option>
                        <option value="h17">H17 - Dealer Hits on Soft 17</option>
                        <option value="enhc">ENHC - European No Hole Card</option>
                    </select>
                </div>

                <hr style="margin: 1rem 0; border: none; border-top: 0.0625rem solid #ccc;" />

                <div class="setting-group">
                    <label for={backgroundModeSelectId}>Background Mode:</label>
                    <select id={backgroundModeSelectId} bind:value={backgroundMode} on:change={onChange}>
                        <option value="webgl">Dynamic (WebGL)</option>
                        <option value="static">Static Color</option>
                    </select>
                </div>

                {#if backgroundMode === 'static'}
                    <div class="setting-group">
                        <label for={staticColorId}>Background Color:</label>
                        <input id={staticColorId} type="color" bind:value={staticColor} on:input={onChange} />
                    </div>
                {/if}

                {#if backgroundMode === 'webgl'}
                    <div class="setting-group">
                        <label for={fpsCapId}>Max Frame Rate (FPS):</label>
                        <input id={fpsCapId} type="number" min="1" max="120" bind:value={fpsCap} on:input={onChange} />
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background: #f0f0f0; /* light gray */
        border-radius: 0.75rem;
        width: 90%;
        max-width: 31.25rem;
        box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.3);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 0.0625rem solid #ccc;
    }

    .modal-body {
        padding: 1.5rem;
    }

    .setting-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    input,
    select {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: 0.0625rem solid #ccc;
        border-radius: 0.25rem;
        background: white;
    }

    .close-btn {
        background: transparent;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }
</style>
