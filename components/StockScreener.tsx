import { ScreenerResultsTable } from './ScreenerResultsTable.js';
import { FilterIcon } from './icons/FilterIcon.js';
import { WarningIcon } from './icons/WarningIcon.js';

export const StockScreener = ({ criteria, isLoading, error, results, hasRun }) => {

  const buttonContent = isLoading 
    ? `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Screening...
    ` 
    : `
      ${FilterIcon({ className: "w-5 h-5 mr-2" })}
      Find Stocks
    `;

  const errorDisplay = error ? `
    <div class="mt-6 flex items-center p-4 bg-red-900/30 border border-red-700/50 text-red-300 rounded-lg">
      ${WarningIcon({ className: "w-6 h-6 mr-3 flex-shrink-0" })}
      <span>${error}</span>
    </div>
  ` : '';
  
  const resultsDisplay = () => {
    if (isLoading) {
        return `<div class="text-center py-10 text-gray-400">AI is searching for matching stocks...</div>`;
    }
    if (hasRun) {
        return ScreenerResultsTable({ results });
    }
    return `<p class="text-center text-gray-500 mt-8">Run a screener to find stocks matching your criteria.</p>`;
  }

  return `
    <div class="space-y-6">
      <form id="stock-screener-form" class="p-6 bg-gray-800/60 rounded-xl border border-gray-700 shadow-lg space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Market Cap -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Market Cap (in Cr ₹)</label>
            <div class="flex items-center space-x-2">
              <input type="number" name="marketCapMin" value="${criteria.marketCapMin}" class="w-full bg-gray-900/50 border border-gray-600 rounded-md py-1.5 px-3 text-sm" placeholder="Min" />
              <span class="text-gray-400">-</span>
              <input type="number" name="marketCapMax" value="${criteria.marketCapMax}" class="w-full bg-gray-900/50 border border-gray-600 rounded-md py-1.5 px-3 text-sm" placeholder="Max" />
            </div>
          </div>
          <!-- P/E Ratio -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">P/E Ratio</label>
            <div class="flex items-center space-x-2">
              <input type="number" name="peRatioMin" value="${criteria.peRatioMin}" class="w-full bg-gray-900/50 border border-gray-600 rounded-md py-1.5 px-3 text-sm" placeholder="Min" />
              <span class="text-gray-400">-</span>
              <input type="number" name="peRatioMax" value="${criteria.peRatioMax}" class="w-full bg-gray-900/50 border border-gray-600 rounded-md py-1.5 px-3 text-sm" placeholder="Max" />
            </div>
          </div>
          <!-- Dividend Yield -->
          <div>
            <label for="dividendYieldMin" class="block text-sm font-medium text-gray-300 mb-1">Min. Dividend Yield (%)</label>
            <input type="number" id="dividendYieldMin" name="dividendYieldMin" value="${criteria.dividendYieldMin}" class="w-full bg-gray-900/50 border border-gray-600 rounded-md py-1.5 px-3 text-sm" placeholder="e.g., 1.5" />
          </div>
        </div>
        <div class="pt-2">
          <button
            type="submit"
            ${isLoading ? 'disabled' : ''}
            class="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ${buttonContent}
          </button>
        </div>
      </form>

      ${errorDisplay}
      ${resultsDisplay()}
    </div>
  `;
};
