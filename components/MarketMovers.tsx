import { RefreshIcon } from './icons/RefreshIcon.js';

const MoverTable = ({ movers }) => {
  if (!movers || movers.length === 0) return '';
  const isGainer = movers[0]?.changePercent > 0;
  return `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="text-gray-400 uppercase bg-gray-700/50">
          <tr>
            <th scope="col" class="px-4 py-2">Symbol</th>
            <th scope="col" class="px-4 py-2 text-right">LTP (₹)</th>
            <th scope="col" class="px-4 py-2 text-right">Change (%)</th>
          </tr>
        </thead>
        <tbody>
          ${movers.map(mover => `
            <tr class="border-b border-gray-700 hover:bg-gray-700/30">
              <td class="px-4 py-2 font-medium text-gray-200 whitespace-nowrap">${mover.symbol}</td>
              <td class="px-4 py-2 text-right">${mover.ltp.toFixed(2)}</td>
              <td class="px-4 py-2 font-bold text-right ${isGainer ? 'text-green-400' : 'text-red-400'}">
                ${isGainer ? '+' : ''}${mover.changePercent.toFixed(2)}%
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

export const MarketMovers = ({ gainers, losers, isLoading, error, activeTab }) => {
  
  const renderContent = () => {
    if (isLoading) {
      return `<div class="text-center py-10 text-gray-400">Loading market data...</div>`;
    }
    if (error) {
      return `<div class="text-center py-10 text-red-400">${error}</div>`;
    }
    if (activeTab === 'gainers' && gainers.length > 0) {
      return MoverTable({ movers: gainers });
    }
    if (activeTab === 'losers' && losers.length > 0) {
      return MoverTable({ movers: losers });
    }
    return `<div class="text-center py-10 text-gray-500">No data available.</div>`;
  };

  return `
    <div class="mt-8 bg-gray-800/60 rounded-xl border border-gray-700 shadow-lg">
      <div class="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 class="text-lg font-semibold text-gray-200">Today's Market Movers</h2>
        <button
          id="market-movers-refresh"
          ${isLoading ? 'disabled' : ''}
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors duration-200 disabled:opacity-50"
          aria-label="Refresh market movers"
        >
          ${RefreshIcon({ className: `w-5 h-5 ${isLoading ? 'animate-spin' : ''}` })}
        </button>
      </div>
      <div class="flex border-b border-gray-700">
        <button
          id="gainers-tab-btn"
          class="w-1/2 py-2 text-center font-medium transition-colors duration-200 ${
            activeTab === 'gainers'
              ? 'text-green-400 border-b-2 border-green-400 bg-green-500/10'
              : 'text-gray-400 hover:bg-gray-700/30'
          }"
        >
          Top Gainers
        </button>
        <button
          id="losers-tab-btn"
          class="w-1/2 py-2 text-center font-medium transition-colors duration-200 ${
            activeTab === 'losers'
              ? 'text-red-400 border-b-2 border-red-400 bg-red-500/10'
              : 'text-gray-400 hover:bg-gray-700/30'
          }"
        >
          Top Losers
        </button>
      </div>
      ${renderContent()}
    </div>
  `;
};
