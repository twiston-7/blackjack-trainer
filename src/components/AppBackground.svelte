<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { createWebGLBackground } from '../logic/webglBackground';

    let canvas: HTMLCanvasElement;
    let bg: ReturnType<typeof createWebGLBackground> | null = null;

    let settings = {
        backgroundMode: 'static' as 'webgl' | 'static',
        staticColor: '#d9d9d9',
        fpsCap: 30
    };

    function normalizeBackgroundMode(mode: unknown): 'webgl' | 'static' {
        return mode === 'webgl' ? 'webgl' : 'static';
    }

    function loadSettings() {
        const saved = localStorage.getItem('userSettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            settings = {
                backgroundMode: normalizeBackgroundMode(parsed.backgroundMode),
                staticColor: parsed.staticColor ?? settings.staticColor,
                fpsCap: parsed.fpsCap ?? settings.fpsCap
            };
        } else {
            settings.backgroundMode = 'static';
        }
    }

    function applyBackground() {
        canvas.style.display = 'none';
        document.body.style.background = '';
        bg?.destroy();
        bg = null;

        if (settings.backgroundMode === 'webgl') {
            canvas.style.display = 'block';
            bg = createWebGLBackground({
                canvas,
                fpsCap: settings.fpsCap ?? 30,
                randomColor: settings.backgroundMode === 'webgl'
            });
            bg.init();
        } else {
            document.body.style.background = settings.staticColor;
        }
    }

    function onSettingsUpdated() {
        loadSettings();
        applyBackground();
    }

    onMount(() => {
        loadSettings();
        applyBackground();
        window.addEventListener('userSettingsUpdated', onSettingsUpdated);
    });

    onDestroy(() => {
        bg?.destroy();
        window.removeEventListener('userSettingsUpdated', onSettingsUpdated);
    });
</script>

<canvas bind:this={canvas} class="bg"></canvas>

<style>
    canvas.bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    }
</style>
