import { useEffect, useState } from 'react';
import type { RuleVariant } from './strategy';
import AppBackground from './components/AppBackground';
import Controls from './components/Controls';
import FeedbackMessage from './components/FeedbackMessage';
import HandPanel from './components/HandPanel';
import SettingsModal from './components/SettingsModal';
import { startNewRound } from './blackjack/core/gameEngine';
import { useGameState } from './stores/gameState';
import './App.css';

export default function App() {
    const [selectedVariant, setSelectedVariant] = useState<RuleVariant>('s17');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const gameState = useGameState();

    useEffect(() => {
        startNewRound();
    }, []);

    const accuracy =
        gameState.totalMoves > 0
            ? Math.round((gameState.correctMoves / gameState.totalMoves) * 100)
            : 0;

    return (
        <>
            <AppBackground />

            <div className="container">
                <div className="header">
                    <div className="title-row">
                        <h1>Blackjack Strategy Trainer</h1>
                        <button className="settings-btn" onClick={() => setSettingsOpen(true)}>
                            ⚙️
                        </button>
                    </div>
                    <div className="stats">
                        <span>
                            Score: {gameState.correctMoves}/{gameState.totalMoves}
                        </span>
                        <span>Accuracy: {accuracy}%</span>
                    </div>
                </div>

                <main className="game-area">
                    <HandPanel
                        title="Dealer"
                        cards={gameState.dealerHand}
                        total={gameState.dealerTotal}
                        panelClass="dealer"
                    />

                    <FeedbackMessage />

                    <HandPanel
                        title="Your Hand"
                        cards={gameState.playerHand}
                        total={gameState.playerTotal}
                        panelClass="player"
                    />
                </main>

                <Controls selectedVariant={selectedVariant} />
            </div>

            <SettingsModal
                isOpen={settingsOpen}
                setIsOpen={setSettingsOpen}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
            />
        </>
    );
}
