import type { Card } from '@app-types/CardType';
import Hand from '@game/Hand';
import '@game/HandPanel.css';

interface HandPanelProps {
    title: string;
    cards?: Card[];
    total?: number;
    showTotal?: boolean;
    panelClass?: string;
}

export default function HandPanel({
    title,
    cards = [],
    total = 0,
    showTotal = true,
    panelClass = '',
}: HandPanelProps) {
    return (
        <div className={`hand-panel ${panelClass === 'dealer' ? 'dealer' : ''}`}>
            <h2>{title}</h2>
            <Hand cards={cards} total={total} showTotal={showTotal} />
        </div>
    );
}
