import { writable } from 'svelte/store';

const SETTINGS_KEY = 'blackjack-settings';

export interface Settings {
    numDecks: number;
    dealerSoft17: 'stand' | 'hit';
    doubleRules: 'any2' | '9-10-11' | '10-11';
    surrender: 'none' | 'early' | 'late';
    doubleAfterSplit: boolean;
    dealerPeeks: boolean;
    backgroundMode: 'webgl' | 'video' | 'static';
    staticColor: string;
    fpsCap: number;
    videoURL: string;
}

function canUseWebGL(): boolean {
    try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
        return false;
    }
}

const defaultSettings: Settings = {
    numDecks: 6,
    dealerSoft17: 'stand',
    doubleRules: 'any2',
    surrender: 'none',
    doubleAfterSplit: true,
    dealerPeeks: true,
    backgroundMode: canUseWebGL() ? 'webgl' : 'video',
    staticColor: '#d9d9d9',
    fpsCap: 30,
    videoURL: 'https://files.catbox.moe/b2ikp8.mp4'
};

function loadSettings(): Settings {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
    }
    return defaultSettings;
}

function createSettingsStore() {
    const { subscribe, set, update } = writable<Settings>(loadSettings());

    return {
        subscribe,
        set: (value: Settings) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
                window.dispatchEvent(new Event('userSettingsUpdated'));
            }
            set(value);
        },
        update: (fn: (current: Settings) => Settings) => {
            update((current) => {
                const newValue = fn(current);
                if (typeof window !== 'undefined') {
                    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newValue));
                    window.dispatchEvent(new Event('userSettingsUpdated'));
                }
                return newValue;
            });
        },
        reset: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(SETTINGS_KEY);
            }
            set(defaultSettings);
        }
    };
}

export const settings = createSettingsStore();
