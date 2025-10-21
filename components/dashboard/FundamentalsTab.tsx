export const FundamentalsTab = ({ data }) => {
  return `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-gray-200 mb-4">Fundamental Metrics</h2>
        <div class="space-y-4">
          ${data.metrics.map(metric => `
            <div class="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <div class="flex justify-between items-baseline">
                <h3 class="font-semibold text-cyan-400">${metric.name}</h3>
                <p class="font-bold text-lg text-gray-200">${metric.value}</p>
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <span class="font-bold not-italic">Mentor's Note:</span> ${metric.explanation}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-200 mb-2">AI Comment: Is the company financially strong or weak?</h3>
        <div>${data.aiComment}</div>
      </div>
    </div>
  `;
};
