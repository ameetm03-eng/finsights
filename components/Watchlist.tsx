import { SparklesIcon } from './icons/SparklesIcon.js';
import { WatchlistPerformance } from './watchlist/WatchlistPerformance.js';

const WatchlistItem = ({ stock }) => {
    
    const alertContent = stock.alertPrice
        ? `
            <div class="flex items-center gap-4">
                <p class="text-sm text-gray-400">
                    Target: <span class="font-bold text-cyan-400">₹${stock.alertPrice.toFixed(2)}</span>
                </p>
                <button 
                    data-symbol="${stock.symbol}"
                    class="remove-alert-btn px-3 py-1.5 text-xs font-medium text-yellow-400 bg-yellow-900/40 hover:bg-yellow-900/80 border border-yellow-800 rounded-md transition-colors"
                >
                    Remove Alert
                </button>
            </div>
        `
        : `
            <form class="watchlist-alert-form flex items-center gap-2" data-symbol="${stock.symbol}">
                <input
                  type="number"
                  name="price"
                  placeholder="Target Price"
                  min="0"
                  step="any"
                  required
                  class="w-32 bg-gray-900/50 border border-gray-600 rounded-md py-1 px-2 text-sm text-gray-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button type="submit" class="px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-900/40 hover:bg-cyan-900/80 border border-cyan-800 rounded-md transition-colors">
                    Set Alert
                </button>
            </form>
        `;

    return `
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-800/60 rounded-lg border border-gray-700 hover:bg-gray-800/80 transition-colors">
        <div>
            <p class="font-bold text-lg text-cyan-400">${stock.symbol}</p>
            <p class="text-sm text-gray-400">${stock.companyName}</p>
        </div>
        <div class="flex items-center space-x-4">
            ${alertContent}
            <button 
                data-symbol="${stock.symbol}"
                class="remove-from-watchlist-btn px-3 py-1.5 text-xs font-medium text-red-400 bg-red-900/40 hover:bg-red-900/80 border border-red-800 rounded-md transition-colors"
            >
                Remove
            </button>
        </div>
    </div>
`};

export const Watchlist = ({ watchlist, user, performanceData, isPerformanceLoading, performanceError }) => {
    const signInPrompt = user ? '' : `
        <div class="p-4 bg-cyan-900/30 rounded-lg border border-cyan-700/50 text-center">
            <p class="text-sm text-cyan-300">
                <button id="open-login-modal-btn" class="font-bold underline hover:text-white">Sign In</button> to save your watchlist permanently.
            </p>
        </div>
    `;

    const watchlistContent = () => {
        if (watchlist.length === 0) {
            return `
                <div class="text-center p-10 bg-gray-800/60 rounded-xl border border-gray-700">
                    ${SparklesIcon({ className: 'w-12 h-12 mx-auto text-gray-600' })}
                    <h3 class="mt-4 text-lg font-semibold text-gray-300">Your Watchlist is Empty</h3>
                    <p class="mt-1 text-gray-500">
                        Use the Stock Analyzer to find stocks and add them to your watchlist.
                    </p>
                </div>
            `;
        }
        return `
            <div class="space-y-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-200">My Stocks</h2>
                        <p class="text-sm text-gray-500 mt-1">
                            Price alerts are checked against today's top market movers when the data is refreshed.
                        </p>
                    </div>
                     ${!user ? `
                        <div class="p-3 bg-cyan-900/30 rounded-lg border border-cyan-700/50 text-center text-sm text-cyan-300 shrink-0">
                            <button id="open-login-modal-btn" class="font-bold underline hover:text-white">Sign In</button> to save.
                        </div>
                    ` : ''}
                </div>
                <div class="space-y-3">
                    ${watchlist.map(stock => WatchlistItem({ stock })).join('')}
                </div>
            </div>
        `;
    };


    return `
        <div class="space-y-8">
            ${WatchlistPerformance({ 
                data: performanceData, 
                isLoading: isPerformanceLoading, 
                error: performanceError,
                hasEnoughStocks: watchlist.length >= 2
            })}
            ${signInPrompt}
            ${watchlistContent()}
        </div>
    `;
};