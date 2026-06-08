import type { Card as CardType } from '../types';
import Card from './Card';
import './Hand.css';

interface HandProps {
    cards?: CardType[];
    showTotal?: boolean;
    total?: number;
}

export default function Hand({ cards = [], showTotal = true, total = 0 }: HandProps) {
    return (
        <div className="hand">
            <div className="cards">
                {cards.map((card, index) => (
                    <Card key={`${card.suit}-${card.rank}-${index}`} suit={card.suit} rank={card.rank} faceDown={card.faceDown || false} />
                ))}
            </div>

            {showTotal && <div className="total">Total: {total}</div>}
        </div>
    );
}
