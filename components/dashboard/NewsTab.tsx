export const NewsTab = ({ data }) => {
  const content = data.items.length > 0 ? 
    data.items.map(item => `
      <div class="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <h3 class="font-semibold text-gray-200">${item.headline}</h3>
        <p class="text-xs text-gray-500 mb-2">Source: ${item.source}</p>
        <div class="text-sm text-gray-400">
          ${item.impactAnalysis}
        </div>
      </div>
    `).join('')
    : `<p class="text-gray-500">No recent news found for this stock.</p>`;

  return `
    <div class="space-y-6">
      <h2 class="text-xl font-bold text-gray-200 mb-4">Recent News & Impact Analysis</h2>
      <div class="space-y-4">
        ${content}
      </div>
    </div>
  `;
};
