export const Tabs = ({ tabs, activeTab }) => {
  return `
    <div class="border-b border-gray-700">
      <nav class="-mb-px flex space-x-4 overflow-x-auto px-4" aria-label="Tabs">
        ${tabs.map(tab => `
          <button
            data-tab="${tab}"
            class="dashboard-tab-btn ${
              activeTab === tab
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors"
          >
            ${tab}
          </button>
        `).join('')}
      </nav>
    </div>
  `;
};
