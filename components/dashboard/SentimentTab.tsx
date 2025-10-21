const getSentimentColor = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('bullish')) return 'text-green-400';
    if (lowerLabel.includes('bearish')) return 'text-red-400';
    return 'text-yellow-400';
}

const getSentimentBgColor = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('bullish')) return 'bg-green-500';
    if (lowerLabel.includes('bearish')) return 'bg-red-500';
    return 'bg-yellow-500';
}

export const SentimentTab = ({ data }) => {
  const sentimentColor = getSentimentColor(data.label);
  const sentimentBgColor = getSentimentBgColor(data.label);

  return `
    <div class="space-y-6">
      <h2 class="text-xl font-bold text-gray-200 mb-4">Market Sentiment Analysis</h2>

      <div class="not-prose bg-gray-900/50 p-6 rounded-lg border border-gray-700">
        <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-400">Sentiment Score</span>
            <span class="text-2xl font-bold ${sentimentColor}">${data.score}/100</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-4">
            <div 
                class="h-4 rounded-full ${sentimentBgColor}" 
                style="width: ${data.score}%"
            ></div>
        </div>
        <div class="text-center mt-3">
            <span class="text-lg font-semibold ${sentimentColor}">${data.label}</span>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-200 mb-2">AI Comment: What's driving the sentiment?</h3>
        <div>${data.aiComment}</div>
      </div>
    </div>
  `;
};
