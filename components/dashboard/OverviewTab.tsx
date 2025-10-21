import { BookmarkIcon } from '../icons/BookmarkIcon.js';

const SWOTList = ({ title, items, color }) => `
  <div>
    <h3 class="text-lg font-semibold mb-2 ${color}">${title}</h3>
    <ul class="list-disc list-inside space-y-1 text-gray-300">
      ${items.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>
`;

export const OverviewTab = ({ data, watchlist = [] }) => {
  const isInWatchlist = watchlist.some(item => item.symbol === data.symbol);

  const watchlistButton = `
    <button 
      id="${isInWatchlist ? 'remove-from-watchlist-btn' : 'add-to-watchlist-btn'}"
      data-symbol="${data.symbol}"
      data-name="${data.companyName}"
      class="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        isInWatchlist 
          ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }"
    >
      ${BookmarkIcon({ className: "w-5 h-5", filled: isInWatchlist })}
      <span>${isInWatchlist ? 'On Watchlist' : 'Add to Watchlist'}</span>
    </button>
  `;

  return `
    <div class="space-y-6">
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="text-2xl font-bold text-gray-100">${data.companyName} (${data.symbol})</h2>
            ${watchlistButton}
        </div>
        <p class="mt-2 text-gray-400">${data.description}</p>
      </div>
      
      <div>
        <h2 class="text-xl font-bold text-gray-200 mb-4">SWOT Analysis</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${SWOTList({ title: "Strengths", items: data.swot.strengths, color: "text-green-400" })}
          ${SWOTList({ title: "Weaknesses", items: data.swot.weaknesses, color: "text-red-400" })}
          ${SWOTList({ title: "Opportunities", items: data.swot.opportunities, color: "text-blue-400" })}
          ${SWOTList({ title: "Threats", items: data.swot.threats, color: "text-yellow-400" })}
        </div>
      </div>
    </div>
  `;
};