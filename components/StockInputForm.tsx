import { SearchIcon } from './icons/SearchIcon.js';

export const StockInputForm = ({ isLoading }) => {

  const buttonContent = isLoading 
    ? `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Generating Finsights...
    ` 
    : `
      ${SearchIcon({ className: "w-5 h-5 mr-2" })}
      Analyze
    `;

  return `
    <form id="stock-input-form" class="p-6 bg-gray-800/60 rounded-xl border border-gray-700 shadow-lg">
      <div class="space-y-4">
        <div>
          <label for="stock-symbol" class="block text-sm font-medium text-gray-300 mb-2">
            Stock Symbol or IPO Name (e.g., RELIANCE, or RELIANCE, TCS for comparison)
          </label>
          <div class="relative">
            <input
              type="text"
              id="stock-symbol"
              name="symbol"
              oninput="this.value = this.value.toUpperCase()"
              placeholder="Enter NSE Symbol(s)"
              class="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 px-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              ${isLoading ? 'disabled' : ''}
              required
            />
          </div>
        </div>

        <div>
          <fieldset>
            <legend class="block text-sm font-medium text-gray-300 mb-2">Mode</legend>
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <input
                  id="detailed"
                  name="reportType"
                  type="radio"
                  value="detailed"
                  checked
                  ${isLoading ? 'disabled' : ''}
                  class="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                />
                <label for="detailed" class="ml-2 block text-sm text-gray-300">
                  Detailed Mode
                </label>
              </div>
              <div class="flex items-center">
                <input
                  id="summary"
                  name="reportType"
                  type="radio"
                  value="summary"
                  ${isLoading ? 'disabled' : ''}
                  class="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                />
                <label for="summary" class="ml-2 block text-sm text-gray-300">
                  Summary Mode
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="mt-6">
        <button
          type="submit"
          ${isLoading ? 'disabled' : ''}
          class="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ${buttonContent}
        </button>
      </div>
    </form>
  `;
};
