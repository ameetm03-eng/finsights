
import { CloseIcon } from './icons/CloseIcon.js';
import { GoogleIcon } from './icons/GoogleIcon.js';
import { PhoneIcon } from './icons/PhoneIcon.js';

export const LoginModal = () => {
  return `
    <div 
      id="login-modal-overlay" 
      class="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4" 
      aria-modal="true"
      role="dialog"
    >
      <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md relative animate-slide-up">
        <button 
            id="close-login-modal-btn" 
            class="absolute top-3 right-3 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close login modal"
        >
            ${CloseIcon({ className: 'w-6 h-6' })}
        </button>

        <div class="p-8">
            <h2 class="text-2xl font-bold text-center text-gray-100">Sign In to Finsights</h2>
            <p class="text-center text-gray-400 mt-2 text-sm">Save your watchlist and access personalized features.</p>

            <div class="mt-6 space-y-4">
                <p class="text-center text-xs text-yellow-400 bg-yellow-900/30 px-3 py-2 rounded-md border border-yellow-700/50">
                    <strong>Note:</strong> This is a UI demonstration. No real authentication is performed. Your name is only saved in your browser.
                </p>
                
                <form id="login-form" class="space-y-4">
                    <div>
                        <label for="user-name" class="block text-sm font-medium text-gray-300 mb-1">
                            Enter Your Name
                        </label>
                        <input
                          type="text"
                          id="user-name"
                          name="name"
                          placeholder="e.g., Jane Doe"
                          required
                          class="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 px-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                        />
                    </div>
                    
                    <div class="flex flex-col space-y-3">
                        <button
                            type="submit"
                            class="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors"
                        >
                            ${GoogleIcon({ className: 'w-5 h-5 mr-3' })}
                            Sign In with Google
                        </button>
                        <button
                            type="submit"
                            class="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors"
                        >
                           ${PhoneIcon({ className: 'w-5 h-5 mr-3' })}
                           Sign In with Phone
                        </button>
                    </div>
                </form>
            </div>
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
