<script lang="ts">
    import type { ComponentType } from 'svelte';
    import type { RuleVariant } from '../strategy';
    import GameSettingsTab from './GameSettingsTab.svelte';
    import BackgroundSettingsTab from './BackgroundSettingsTab.svelte';

    export let isOpen: boolean = false;
    export let selectedVariant: RuleVariant;

    interface Tab {
        id: string;
        label: string;
        component: ComponentType;
    }

    const tabs: Tab[] = [
        { id: 'game', label: 'Game Rules', component: GameSettingsTab },
        { id: 'background', label: 'Background', component: BackgroundSettingsTab }
    ];

    let activeTab: string = tabs[0]?.id || '';

    $: if (tabs.length > 0 && !activeTab) {
        activeTab = tabs[0].id;
    }

    function handleOverlayClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            isOpen = false;
        }
    }

    function closeModal() {
        isOpen = false;
    }
</script>

{#if isOpen}
    <div class="modal-overlay" on:click={handleOverlayClick}>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Settings</h2>
                <button class="close-btn" on:click={closeModal}>&times;</button>
            </div>

            <div class="tabs">
                {#each tabs as tab}
                    <button
                            class="tab-btn"
                            class:active={activeTab === tab.id}
                            on:click={() => activeTab = tab.id}
                    >
                        {tab.label}
                    </button>
                {/each}
            </div>

            <div class="tab-content">
                {#each tabs as tab}
                    {#if activeTab === tab.id}
                        <svelte:component this={tab.component} bind:selectedVariant />
                    {/if}
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: #1a1a1a;
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #333;
    }

    .modal-header h2 {
        margin: 0;
        color: #fff;
    }

    .close-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }

    .close-btn:hover {
        color: #ff4444;
    }

    .tabs {
        display: flex;
        border-bottom: 1px solid #333;
        background: #0d0d0d;
    }

    .tab-btn {
        flex: 1;
        padding: 1rem;
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
        border-bottom: 2px solid transparent;
    }

    .tab-btn:hover {
        color: #fff;
        background: #1a1a1a;
    }

    .tab-btn.active {
        color: #fff;
        border-bottom-color: #4CAF50;
    }

    .tab-content {
        padding: 1.5rem;
        overflow-y: auto;
        flex: 1;
    }
</style>
