export const AppTabs = ({ activeAppTab }) => {
  return `
    <div class="mb-6 border-b border-gray-700">
      <nav class="-mb-px flex space-x-6" aria-label="Tabs">
        <button
          id="analyzer-tab-btn"
          class="${
            activeAppTab === 'analyzer'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
          } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg transition-colors"
        >
          Stock Analyzer
        </button>
        <button
          id="screener-tab-btn"
          class="${
            activeAppTab === 'screener'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
          } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg transition-colors"
        >
          AI Stock Screener
        </button>
        <button
          id="watchlist-tab-btn"
          class="${
            activeAppTab === 'watchlist'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
          } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg transition-colors"
        >
          Watchlist
        </button>
        <button
          id="learn-tab-btn"
          class="${
            activeAppTab === 'learn'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
          } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg transition-colors"
        >
          Learn
        </button>
      </nav>
    </div>
  `;
};