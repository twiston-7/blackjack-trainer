<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { createWebGLBackground } from '../logic/webglBackground';

    let canvas: HTMLCanvasElement;
    let videoEl: HTMLVideoElement | null = null;
    let bg: ReturnType<typeof createWebGLBackground> | null = null;

    let settings = {
        backgroundMode: 'static' as 'webgl' | 'video' | 'static',
        staticColor: '#d9d9d9',
        videoURL: 'https://files.catbox.moe/b2ikp8.mp4',
        fpsCap: 30
    };

    function loadSettings() {
        const saved = localStorage.getItem('userSettings');
        if (saved) {
            settings = JSON.parse(saved);
        } else {
            settings.backgroundMode = canUseWebGL() ? 'webgl' : 'video';
        }
    }

    function canUseWebGL(): boolean {
        try {
            const c = document.createElement('canvas');
            return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
        } catch {
            return false;
        }
    }

    function applyBackground() {
        canvas.style.display = 'none';
        if (videoEl) videoEl.style.display = 'none';
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
        } else if (settings.backgroundMode === 'video') {
            if (!videoEl) {
                videoEl = document.createElement('video');
                videoEl.autoplay = true;
                videoEl.loop = true;
                videoEl.muted = true;
                videoEl.playsInline = true;

                // Make the video element completely uninteractive and hide any controls
                Object.assign(videoEl.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: '-1',
                    pointerEvents: 'none',
                    // Explicitly disable any built-in UI
                    controls: false
                });

                // Block potential PiP by default
                // Note: This is a DOM attribute; it prevents browsers from inviting PiP UI for this element
                // and ensures no PiP-related UI is shown for this video.
                (videoEl as any).disablePictureInPicture = true;
                // Also set the attribute for broader browser support
                videoEl.setAttribute('disablePictureInPicture', 'true');
                // In case the browser respects the "controlsList" hint, avoid any download or PiP hints
                videoEl.setAttribute('controlsList', 'nodownload nofullscreen');
                document.body.appendChild(videoEl);
            }

            videoEl.src = settings.videoURL;
            videoEl.style.display = 'block';
            // Attempt to play; catch and ignore if user gesture is required
            videoEl.play().catch(() => {});
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

<canvas bind:this={canvas} class="bg" />

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
