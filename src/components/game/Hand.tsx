import type { Card } from '@app-types/CardType';
import PlayingCard from '@game/Card';
import '@game/Hand.css';

interface HandProps {
    cards?: Card[];
    showTotal?: boolean;
    total?: number;
}

export default function Hand({ cards = [], showTotal = true, total = 0 }: HandProps) {
    return (
        <div className="hand">
            <div className="cards">
                {cards.map((card, index) => (
                    <PlayingCard key={`${card.suit}-${card.rank}-${index}`} suit={card.suit} rank={card.rank} faceDown={card.faceDown || false} />
                ))}
            </div>

            {showTotal && <div className="total">Total: {total}</div>}
        </div>
    );
}
