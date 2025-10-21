const StrategyMetric = ({ label, value, colorClass = 'text-gray-200' }) => `
    <div class="flex flex-col p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-center">
        <span class="text-sm font-medium text-gray-400 mb-1">${label}</span>
        <span class="text-xl font-bold ${colorClass}">${value}</span>
    </div>
`;

const KeyLevelsList = ({title, levels, colorClass}) => `
    <div class="p-4 bg-gray-900/50 rounded-lg">
        <h4 class="text-md font-semibold mb-2 ${colorClass}">${title}</h4>
        <ul class="list-disc list-inside space-y-1">
            ${levels.map(level => `<li>${level}</li>`).join('')}
        </ul>
    </div>
`;

export const StrategyTab = ({ data }) => {
    const getRiskClass = (risk) => {
        if (risk.toLowerCase() === 'high') return 'text-red-400';
        if (risk.toLowerCase() === 'medium') return 'text-yellow-400';
        return 'text-green-400';
    }

  return `
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-bold text-gray-200">${data.strategyType}</h2>
        <p class="text-gray-400">Time Horizon: ${data.timeHorizon}</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose">
        ${StrategyMetric({ label: "Entry Zone", value: data.entryZone })}
        ${StrategyMetric({ label: "Target Price", value: data.targetPrice, colorClass: "text-green-400" })}
        ${StrategyMetric({ label: "Stop-Loss", value: data.stopLoss, colorClass: "text-red-400" })}
        ${StrategyMetric({ label: "Risk Level", value: data.riskLevel, colorClass: getRiskClass(data.riskLevel) })}
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-200 mb-2">Strategy Rationale</h3>
        <div class="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            ${data.rationale}
        </div>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-200 mb-2">Key Levels to Watch</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            ${KeyLevelsList({ title: "Support", levels: data.keyLevels.support, colorClass: "text-green-400" })}
            ${KeyLevelsList({ title: "Resistance", levels: data.keyLevels.resistance, colorClass: "text-red-400" })}
        </div>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-200 mb-2">Risk Management</h3>
        <div class="p-4 bg-yellow-900/30 rounded-lg border border-yellow-700/50 text-yellow-300">
            <p><strong class="font-bold">Position Sizing Tip:</strong> ${data.positionSizingTip}</p>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-200 mb-2">Mentor's Final Word</h3>
        <div class="p-4 bg-cyan-900/30 rounded-lg border border-cyan-700/50">
            ${data.teachingTip}
        </div>
      </div>
    </div>
  `;
};
