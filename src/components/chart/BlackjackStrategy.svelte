// BlackjackStrategy.svelte
<script lang="ts">
    interface GameRules {
        numDecks: number;
        dealerHitsSoft17: boolean;
        doubleAfterSplit: boolean;
        surrenderType: string;
        doubleRestriction: string;
        dealerPeeksBlackjack: boolean;
        resplitAces: boolean;
        maxSplits: number;
    }

    interface StrategyData {
        rules: GameRules;
        decisions: Record<string, string>;
    }

    export let strategyData: StrategyData;

    // Action colors
    const actionColors: Record<string, string> = {
        HIT: '#ff6b6b',
        STAND: '#51cf66',
        DOUBLE: '#339af0',
        SPLIT: '#ffd43b',
        SURRENDER: '#ff8787'
    };

    // Dealer up cards
    const dealerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

    // Parse decisions into structured data
    function parseDecisions() {
        const hardTotals: Record<string, Record<string, string>> = {};
        const softTotals: Record<string, Record<string, string>> = {};
        const pairs: Record<string, Record<string, string>> = {};

        for (const [key, action] of Object.entries(strategyData.decisions)) {
            const [handType, dealerCard] = key.split('_');
            const prefix = handType[0];
            const value = handType.substring(1);

            if (prefix === 'H') {
                if (!hardTotals[value]) hardTotals[value] = {};
                hardTotals[value][dealerCard] = action;
            } else if (prefix === 'S') {
                if (!softTotals[value]) softTotals[value] = {};
                softTotals[value][dealerCard] = action;
            } else if (prefix === 'P') {
                if (!pairs[value]) pairs[value] = {};
                pairs[value][dealerCard] = action;
            }
        }

        return { hardTotals, softTotals, pairs };
    }

    const { hardTotals, softTotals, pairs } = parseDecisions();

    // Get sorted player hands
    const hardHands = Object.keys(hardTotals).map(Number).sort((a, b) => b - a);
    const softHands = Object.keys(softTotals).map(Number).sort((a, b) => b - a);
    const pairHands = ['A', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

    function getAction(handMap: Record<string, string>, dealerCard: string): string {
        return handMap[dealerCard] || '';
    }

    function formatAction(action: string): string {
        if (action === 'SURRENDER') return 'Surr';
        return action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
    }

    function formatRules(rules: GameRules): string[] {
        return [
            `${rules.numDecks} Deck${rules.numDecks > 1 ? 's' : ''}`,
            rules.dealerHitsSoft17 ? 'H17' : 'S17',
            rules.doubleAfterSplit ? 'DAS' : 'No DAS',
            `${rules.surrenderType.charAt(0)}${rules.surrenderType.slice(1).toLowerCase()} Surrender`,
            `Double: ${rules.doubleRestriction}`,
            rules.dealerPeeksBlackjack ? 'Peek' : 'No Peek',
            rules.resplitAces ? 'RSA' : 'No RSA',
            `Max ${rules.maxSplits} Splits`
        ];
    }
</script>

<div class="strategy-container">
    <!-- Rules Section -->
    <div class="rules-section">
        <h2>Game Rules</h2>
        <div class="rules-grid">
            {#each formatRules(strategyData.rules) as rule}
                <span class="rule-badge">{rule}</span>
            {/each}
        </div>
    </div>

    <!-- Hard Totals -->
    <div class="chart-section">
        <h3>Hard Totals</h3>
        <div class="chart-wrapper">
            <table class="strategy-table">
                <thead>
                <tr>
                    <th>Player</th>
                    {#each dealerCards as card}
                        <th>{card}</th>
                    {/each}
                </tr>
                </thead>
                <tbody>
                {#each hardHands as hand}
                    <tr>
                        <td class="player-hand">{hand}</td>
                        {#each dealerCards as dealerCard}
                            {@const action = getAction(hardTotals[hand.toString()], dealerCard)}
                            <td
                                    class="action-cell"
                                    style="background-color: {actionColors[action] || '#e9ecef'}; color: {action === 'DOUBLE' || action === 'SPLIT' ? '#000' : '#fff'};"
                            >
                                {formatAction(action)}
                            </td>
                        {/each}
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Soft Totals -->
    <div class="chart-section">
        <h3>Soft Totals</h3>
        <div class="chart-wrapper">
            <table class="strategy-table">
                <thead>
                <tr>
                    <th>Player</th>
                    {#each dealerCards as card}
                        <th>{card}</th>
                    {/each}
                </tr>
                </thead>
                <tbody>
                {#each softHands as hand}
                    <tr>
                        <td class="player-hand">A,{hand - 11}</td>
                        {#each dealerCards as dealerCard}
                            {@const action = getAction(softTotals[hand.toString()], dealerCard)}
                            <td
                                    class="action-cell"
                                    style="background-color: {actionColors[action] || '#e9ecef'}; color: {action === 'DOUBLE' || action === 'SPLIT' ? '#000' : '#fff'};"
                            >
                                {formatAction(action)}
                            </td>
                        {/each}
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Pairs -->
    <div class="chart-section">
        <h3>Pairs</h3>
        <div class="chart-wrapper">
            <table class="strategy-table">
                <thead>
                <tr>
                    <th>Player</th>
                    {#each dealerCards as card}
                        <th>{card}</th>
                    {/each}
                </tr>
                </thead>
                <tbody>
                {#each pairHands as hand}
                    <tr>
                        <td class="player-hand">{hand},{hand}</td>
                        {#each dealerCards as dealerCard}
                            {@const action = getAction(pairs[hand], dealerCard)}
                            <td
                                    class="action-cell"
                                    style="background-color: {actionColors[action] || '#e9ecef'}; color: {action === 'DOUBLE' || action === 'SPLIT' ? '#000' : '#fff'};"
                            >
                                {formatAction(action)}
                            </td>
                        {/each}
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Legend -->
    <div class="legend">
        <h3>Legend</h3>
        <div class="legend-items">
            {#each Object.entries(actionColors) as [action, color]}
                <div class="legend-item">
                    <div class="legend-color" style="background-color: {color};"></div>
                    <span>{formatAction(action)}</span>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .strategy-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .rules-section {
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .rules-section h2 {
        margin: 0 0 15px 0;
        color: #212529;
        font-size: 1.5rem;
    }

    .rules-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .rule-badge {
        background: #fff;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        border: 1px solid #dee2e6;
        color: #495057;
        font-weight: 500;
    }

    .chart-section {
        margin-bottom: 30px;
    }

    .chart-section h3 {
        margin: 0 0 15px 0;
        color: #212529;
        font-size: 1.3rem;
    }

    .chart-wrapper {
        overflow-x: auto;
    }

    .strategy-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
    }

    .strategy-table th {
        background: #343a40;
        color: white;
        padding: 12px;
        font-weight: 600;
        text-align: center;
        font-size: 0.9rem;
    }

    .player-hand {
        background: #495057;
        color: white;
        font-weight: 600;
        text-align: center;
        padding: 12px;
        font-size: 0.9rem;
    }

    .action-cell {
        padding: 12px;
        text-align: center;
        font-weight: 600;
        font-size: 0.85rem;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .legend {
        margin-top: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .legend h3 {
        margin: 0 0 15px 0;
        color: #212529;
        font-size: 1.2rem;
    }

    .legend-items {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .legend-color {
        width: 30px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .legend-item span {
        font-weight: 500;
        color: #495057;
    }

    @media (max-width: 768px) {
        .strategy-container {
            padding: 10px;
        }

        .strategy-table {
            font-size: 0.8rem;
        }

        .strategy-table th,
        .player-hand,
        .action-cell {
            padding: 8px 4px;
        }

        .rules-grid {
            gap: 5px;
        }

        .rule-badge {
            font-size: 0.8rem;
            padding: 6px 12px;
        }
    }
</style>
