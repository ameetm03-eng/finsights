import { CloseIcon } from '../icons/CloseIcon.js';
import { LoadingSpinner } from '../LoadingSpinner.js';
import { WarningIcon } from '../icons/WarningIcon.js';

export const LearnModal = ({ topicId, isLoading, error, topicData }) => {

    const renderContent = () => {
        if (isLoading) {
            return `
                <div class="flex flex-col items-center justify-center p-10">
                    ${LoadingSpinner()}
                    <p class="mt-4 text-gray-400">Loading explanation...</p>
                </div>
            `;
        }

        if (error) {
            return `
                 <div class="flex flex-col items-center justify-center p-10 text-center">
                    ${WarningIcon({ className: "w-10 h-10 text-red-500" })}
                    <h3 class="mt-4 font-semibold text-red-400">Error Loading Content</h3>
                    <p class="mt-1 text-sm text-red-400/80">${error}</p>
                </div>
            `;
        }

        if (topicData) {
            return `
                <div class="p-6 sm:p-8">
                    <h2 class="text-2xl font-bold text-gray-100">${topicData.title}</h2>
                    <div class="prose prose-sm sm:prose-base prose-invert max-w-none mt-4 text-gray-300">
                        ${topicData.content}
                    </div>
                </div>
            `;
        }

        return '';
    };

  return `
    <div 
      id="learn-modal-overlay" 
      class="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4" 
      aria-modal="true"
      role="dialog"
    >
      <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl relative animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
        <div class="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-cyan-400">Finsights Tutor</h3>
            <button 
                id="close-learn-modal-btn" 
                class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Close learn modal"
            >
                ${CloseIcon({ className: 'w-6 h-6' })}
            </button>
        </div>

        <div class="flex-grow overflow-y-auto">
            ${renderContent()}
        </div>
      </div>
      <style>
          @keyframes slide-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
              animation: slide-up 0.3s ease-out forwards;
          }
      </style>
    </div>
  `;
};