import type { Rank } from '@app-types/Rank';
import type { Suit } from '@app-types/Suit';
import { calculatePipPositions, getPipCount, getPipSizeForSuit } from '@util/cardPips';
import '@game/Card.css';

interface CardProps {
    suit?: Suit;
    rank?: Rank;
    faceDown?: boolean;
}

export default function Card({ suit = '♠', rank = 'A', faceDown = false }: CardProps) {
    const isFaceCard = ['J', 'Q', 'K'].includes(rank);
    const pipCount = getPipCount(rank);
    const pipPositions = calculatePipPositions(pipCount);
    const pipSize = getPipSizeForSuit(suit, rank);
    const isTen = rank === '10';
    const faceCardImageSrc = `${import.meta.env.BASE_URL}cards/${rank.toLowerCase()}.png`;

    return (
        <div className={`card ${faceDown ? 'face-down' : ''}`}>
            {!faceDown ? (
                <div className={`card-content ${suit === '♥' || suit === '♦' ? 'red' : ''}`}>
                    <div className={`corner top-left ${isTen ? 'ten' : ''}`}>
                        <div className="rank">{rank}</div>
                        <div className="suit-small">{suit}</div>
                    </div>

                    {isFaceCard ? (
                        <div className="face-card">
                            <img src={faceCardImageSrc} alt={`${rank} of ${suit}`} />
                        </div>
                    ) : (
                        <div className="pips">
                            {pipPositions.map((position, index) => (
                                <div
                                    key={`${rank}-${suit}-${index}`}
                                    className="pip"
                                    style={{
                                        top: `${position.top}%`,
                                        left: `${position.left}%`,
                                        fontSize: pipSize,
                                        transform: `translate(-50%, -50%) rotate(${position.rotate || 0}deg)`,
                                    }}
                                >
                                    {suit}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`corner bottom-right ${isTen ? 'ten' : ''}`}>
                        <div className="rank">{rank}</div>
                        <div className="suit-small">{suit}</div>
                    </div>
                </div>
            ) : (
                <div className="card-back"></div>
            )}
        </div>
    );
}
