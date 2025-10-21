export const ComparisonTab = ({ data }) => {
  return `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-gray-200 mb-2">AI Verdict: Which stock looks stronger?</h2>
        <div class="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            ${data.verdict}
        </div>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-200 mb-2">Side-by-Side Comparison</h3>
        <div class="prose prose-sm prose-invert max-w-none not-prose overflow-x-auto">
          ${data.table}
        </div>
      </div>
    </div>
  `;
};
