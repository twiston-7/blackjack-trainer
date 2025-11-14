<script lang="ts">
    export let title: string = '';
</script>

<div class="settings-tab">
    {#if title}
        <h3 class="tab-title">{title}</h3>
    {/if}
    <div class="settings-content">
        <slot />
    </div>
</div>

<style>
    .settings-tab {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .tab-title {
        margin: 0 0 0.5rem 0;
        color: #fff;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .settings-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
