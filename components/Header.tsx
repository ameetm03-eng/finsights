
import { SparklesIcon } from './icons/SparklesIcon.js';
import { UserIcon } from './icons/UserIcon.js';

export const Header = ({ user }) => {

  const userDisplay = user
    ? `
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2 text-sm">
            ${UserIcon({ className: 'w-5 h-5 text-gray-400' })}
            <span class="text-gray-300">Welcome, ${user.name}</span>
        </div>
        <button id="logout-btn" class="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">Sign Out</button>
      </div>
    `
    : `
      <button id="open-login-modal-btn" class="bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2 px-4 rounded-lg text-sm transition-colors">
        Sign In
      </button>
    `;

  return `
    <header class="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-20">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-center space-x-3">
            ${SparklesIcon({ className: "w-8 h-8 text-cyan-400" })}
            <h1 class="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-cyan-400">
              Finsights
            </h1>
          </div>
          <div>
            ${userDisplay}
          </div>
        </div>
      </div>
    </header>
  `;
};
