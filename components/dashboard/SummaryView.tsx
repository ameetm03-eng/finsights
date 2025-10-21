import { SparklesIcon } from '../icons/SparklesIcon.js';

export const SummaryView = ({ summaryPoints }) => {
  return `
    <div class="mt-8 bg-gray-800/60 rounded-xl border border-gray-700 shadow-lg p-6">
      <h2 class="text-xl font-bold text-gray-200 mb-4">Stock Summary</h2>
      <ul class="space-y-3">
        ${summaryPoints.map(point => `
          <li class="flex items-start">
            ${SparklesIcon({ className: "w-4 h-4 text-cyan-400 mr-3 mt-1 flex-shrink-0" })}
            <span class="text-gray-300">${point}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
};
