import type { RuleVariant } from '@strategy';
import type { Action } from '@app-types/Action';
import { getActionButtonState, startNewRound, submitPlayerAction } from '@core/gameEngine';
import { useGameState } from '@stores/gameState';
import '@game/Controls.css';

interface ControlsProps {
    selectedVariant: RuleVariant;
}

export default function Controls({ selectedVariant }: ControlsProps) {
    useGameState();
    const buttonState = getActionButtonState();

    const handleAction = (action: Action) => {
        submitPlayerAction(action, selectedVariant);
    };

    return (
        <div className="controls">
            <button onClick={() => handleAction('hit')} disabled={!buttonState.canAct}>
                Hit
            </button>
            <button onClick={() => handleAction('stand')} disabled={!buttonState.canAct}>
                Stand
            </button>
            <button onClick={() => handleAction('double')} disabled={!buttonState.canDouble}>
                Double
            </button>
            <button onClick={() => handleAction('split')} disabled={!buttonState.canSplit}>
                Split
            </button>
            <button onClick={startNewRound} className="new-game">
                Skip
            </button>
        </div>
    );
}
