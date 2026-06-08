import { useGameState } from '@stores/gameState';
import '@feedback/FeedbackMessage.css';

export default function FeedbackMessage() {
    const state = useGameState();

    return (
        <div className="feedback-container">
            {state.feedback ? (
                <div className={`feedback ${state.feedbackType === 'correct' ? 'correct' : ''} ${state.feedbackType === 'incorrect' ? 'incorrect' : ''}`}>
                    {state.feedback}
                </div>
            ) : null}
        </div>
    );
}
