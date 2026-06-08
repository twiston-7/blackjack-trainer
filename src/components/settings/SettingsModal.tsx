import { useEffect, useState } from 'react';
import type { RuleVariant } from '@strategy';
import '@settings/SettingsModal.css';

interface SettingsModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedVariant: RuleVariant;
    setSelectedVariant: (variant: RuleVariant) => void;
}

type BackgroundMode = 'webgl' | 'static';

interface UserSettings {
    backgroundMode: BackgroundMode;
    staticColor: string;
    fpsCap: number;
    rules: RuleVariant;
}

const rulesSelectId = 'blackjack-rules-select';
const backgroundModeSelectId = 'background-mode-select';
const staticColorId = 'background-color-input';
const fpsCapId = 'fps-cap-input';

export default function SettingsModal({
    isOpen,
    setIsOpen,
    selectedVariant,
    setSelectedVariant,
}: SettingsModalProps) {
    const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('static');
    const [staticColor, setStaticColor] = useState('#d9d9d9');
    const [fpsCap, setFpsCap] = useState(30);
    const [initialized, setInitialized] = useState(false);

    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        const saved = localStorage.getItem('userSettings');
        if (saved) {
            const parsed = JSON.parse(saved) as Partial<UserSettings>;
            setBackgroundMode(parsed.backgroundMode === 'webgl' ? 'webgl' : 'static');
            setStaticColor(parsed.staticColor ?? '#d9d9d9');
            setFpsCap(parsed.fpsCap ?? 30);
            if (parsed.rules) {
                setSelectedVariant(parsed.rules);
            }
        } else {
            setBackgroundMode('static');
        }
        setInitialized(true);
    }, [setSelectedVariant]);

    useEffect(() => {
        if (!initialized) {
            return;
        }

        const settings: UserSettings = {
            backgroundMode,
            staticColor,
            fpsCap,
            rules: selectedVariant,
        };

        localStorage.setItem('userSettings', JSON.stringify(settings));
        window.dispatchEvent(new Event('userSettingsUpdated'));
    }, [backgroundMode, staticColor, fpsCap, selectedVariant, initialized]);

    const onBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    const onBackdropKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            closeModal();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="modal-backdrop"
            role="button"
            tabIndex={0}
            aria-label="Close settings dialog"
            onClick={onBackdropClick}
            onKeyDown={onBackdropKeyDown}
        >
            <div className="modal">
                <div className="modal-header">
                    <h2>Settings</h2>
                    <button type="button" className="close-btn" onClick={closeModal}>
                        &times;
                    </button>
                </div>

                <div className="modal-body">
                    <div className="setting-group">
                        <label htmlFor={rulesSelectId}>Blackjack Rules:</label>
                        <select
                            id={rulesSelectId}
                            value={selectedVariant}
                            onChange={(event) => setSelectedVariant(event.target.value as RuleVariant)}
                        >
                            <option value="s17">S17 - Dealer Stands on Soft 17</option>
                            <option value="h17">H17 - Dealer Hits on Soft 17</option>
                            <option value="enhc">ENHC - European No Hole Card</option>
                        </select>
                    </div>

                    <hr className="settings-divider" />

                    <div className="setting-group">
                        <label htmlFor={backgroundModeSelectId}>Background Mode:</label>
                        <select
                            id={backgroundModeSelectId}
                            value={backgroundMode}
                            onChange={(event) => setBackgroundMode(event.target.value as BackgroundMode)}
                        >
                            <option value="webgl">Dynamic (WebGL)</option>
                            <option value="static">Static Color</option>
                        </select>
                    </div>

                    {backgroundMode === 'static' ? (
                        <div className="setting-group">
                            <label htmlFor={staticColorId}>Background Color:</label>
                            <input
                                id={staticColorId}
                                type="color"
                                value={staticColor}
                                onChange={(event) => setStaticColor(event.target.value)}
                            />
                        </div>
                    ) : null}

                    {backgroundMode === 'webgl' ? (
                        <div className="setting-group">
                            <label htmlFor={fpsCapId}>Max Frame Rate (FPS):</label>
                            <input
                                id={fpsCapId}
                                type="number"
                                min={1}
                                max={120}
                                value={fpsCap}
                                onChange={(event) => {
                                    const value = Number(event.target.value);
                                    setFpsCap(Number.isFinite(value) ? value : 30);
                                }}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
