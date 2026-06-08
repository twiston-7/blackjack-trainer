import type { Card as CardType } from '../types';
import Hand from './Hand';
import './HandPanel.css';

interface HandPanelProps {
    title: string;
    cards?: CardType[];
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
