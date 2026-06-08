import { useEffect, useRef } from 'react';
import { createWebGLBackground } from '@logic/webglBackground';
import '@background/AppBackground.css';

type BackgroundMode = 'webgl' | 'static';

interface UserSettings {
    backgroundMode: BackgroundMode;
    staticColor: string;
    fpsCap: number;
}

function normalizeBackgroundMode(mode: unknown): BackgroundMode {
    return mode === 'webgl' ? 'webgl' : 'static';
}

function readSettings(defaults: UserSettings): UserSettings {
    const saved = localStorage.getItem('userSettings');
    if (!saved) {
        return { ...defaults, backgroundMode: 'static' };
    }

    const parsed = JSON.parse(saved) as Partial<UserSettings>;
    return {
        backgroundMode: normalizeBackgroundMode(parsed.backgroundMode),
        staticColor: parsed.staticColor ?? defaults.staticColor,
        fpsCap: parsed.fpsCap ?? defaults.fpsCap,
    };
}

export default function AppBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const bgRef = useRef<ReturnType<typeof createWebGLBackground> | null>(null);
    const settingsRef = useRef<UserSettings>({
        backgroundMode: 'static',
        staticColor: '#d9d9d9',
        fpsCap: 30,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const applyBackground = () => {
            const settings = settingsRef.current;
            canvas.style.display = 'none';
            document.body.style.background = '';
            bgRef.current?.destroy();
            bgRef.current = null;

            if (settings.backgroundMode === 'webgl') {
                canvas.style.display = 'block';
                bgRef.current = createWebGLBackground({
                    canvas,
                    fpsCap: settings.fpsCap ?? 30,
                    randomColor: true,
                });
                bgRef.current.init();
            } else {
                document.body.style.background = settings.staticColor;
            }
        };

        const onSettingsUpdated = () => {
            settingsRef.current = readSettings(settingsRef.current);
            applyBackground();
        };

        settingsRef.current = readSettings(settingsRef.current);
        applyBackground();
        window.addEventListener('userSettingsUpdated', onSettingsUpdated);

        return () => {
            bgRef.current?.destroy();
            window.removeEventListener('userSettingsUpdated', onSettingsUpdated);
        };
    }, []);

    return <canvas ref={canvasRef} className="bg" />;
}
