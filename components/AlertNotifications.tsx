import { BellIcon } from './icons/BellIcon.js';
import { CloseIcon } from './icons/CloseIcon.js';

export const AlertNotifications = ({ alerts }) => {
    if (!alerts || alerts.length === 0) return '';

    return `
        <div class="my-6 space-y-3">
            ${alerts.map(alert => `
                <div class="flex items-start p-4 bg-cyan-900/40 border border-cyan-700/50 text-cyan-200 rounded-lg shadow-lg animate-fade-in" role="alert">
                    ${BellIcon({ className: 'w-6 h-6 mr-4 flex-shrink-0 text-cyan-300' })}
                    <div class="flex-grow">
                        <p class="font-bold">Price Alert Triggered!</p>
                        <p class="text-sm mt-1">
                            <strong>${alert.companyName} (${alert.symbol})</strong> has reached your target of ₹${alert.targetPrice.toFixed(2)}. 
                            Current price: <strong class="text-white">₹${alert.currentPrice.toFixed(2)}</strong>.
                        </p>
                    </div>
                    <button 
                        data-symbol="${alert.symbol}" 
                        class="dismiss-alert-btn p-1 -mt-2 -mr-2 text-cyan-300 hover:text-white rounded-full hover:bg-cyan-500/20 transition-colors"
                        aria-label="Dismiss alert"
                    >
                        ${CloseIcon({ className: 'w-5 h-5' })}
                    </button>
                </div>
            `).join('')}
            <style>
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            </style>
        </div>
    `;
};
