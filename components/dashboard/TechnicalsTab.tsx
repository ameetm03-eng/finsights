import { Chart } from 'chart.js';

const getSignalClass = (signal) => {
    switch (signal) {
        case 'Bullish': return 'bg-green-500/20 text-green-400';
        case 'Bearish': return 'bg-red-500/20 text-red-400';
        default: return 'bg-yellow-500/20 text-yellow-400';
    }
}

export const TechnicalsTab = ({ data }) => {
  const { chartData, indicators, aiComment } = data;

  const chartHTML = chartData ? `
    <div class="not-prose space-y-8">
      <div class="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <h3 class="text-lg font-semibold text-center mb-2 text-gray-300">Price & Moving Averages</h3>
          <div style="height: 300px">
              <canvas id="price-chart"></canvas>
          </div>
      </div>
      <div class="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <h3 class="text-lg font-semibold text-center mb-2 text-gray-300">Oscillators (RSI & MACD)</h3>
          <div style="height: 250px">
              <canvas id="oscillators-chart"></canvas>
          </div>
      </div>
    </div>
  ` : `<p class="text-gray-500">Chart data is not available for this stock.</p>`;

  return `
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-bold text-gray-200 mb-4">Technical Charts</h2>
        ${chartHTML}
      </div>

       <div>
        <h2 class="text-xl font-bold text-gray-200 mb-4">Indicator Signals</h2>
        <div class="space-y-4">
          ${indicators.map(indicator => `
            <div class="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <div class="flex justify-between items-center">
                <h3 class="font-semibold text-cyan-400">${indicator.name}</h3>
                <div class="flex items-center space-x-4">
                    <p class="font-bold text-lg text-gray-200">${indicator.value}</p>
                    <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${getSignalClass(indicator.signal)}">
                        ${indicator.signal}
                    </span>
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-400 italic">
                <span class="font-bold not-italic">Mentor's Note:</span> ${indicator.explanation}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-200 mb-2">AI Comment: What's the technical outlook?</h3>
        <div>${aiComment}</div>
      </div>
    </div>
  `;
};


// --- Chart.js specific code ---
// This function will be called after the HTML is rendered to the DOM
export function initializeCharts(technicalsData) {
    if (!technicalsData || !technicalsData.chartData) return;

    const { chartData } = technicalsData;
    
    // Destroy existing charts if they exist to prevent memory leaks
    if (Chart.getChart('price-chart')) {
        Chart.getChart('price-chart').destroy();
    }
    if (Chart.getChart('oscillators-chart')) {
        Chart.getChart('oscillators-chart').destroy();
    }
    
    // FIX: Cast the element to HTMLCanvasElement to access getContext.
    const priceChartCtx = (document.getElementById('price-chart') as HTMLCanvasElement)?.getContext('2d');
    // FIX: Cast the element to HTMLCanvasElement to access getContext.
    const oscillatorsChartCtx = (document.getElementById('oscillators-chart') as HTMLCanvasElement)?.getContext('2d');

    if (!priceChartCtx || !oscillatorsChartCtx) return;

    const chartOptionsBase = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#9ca3af', font: { size: 12 } }
            },
            tooltip: {
                backgroundColor: '#1f2937', titleColor: '#d1d5db', bodyColor: '#d1d5db',
                borderColor: '#4b5563', borderWidth: 1,
            }
        },
        scales: {
            x: {
                ticks: { color: '#9ca3af', maxRotation: 45, minRotation: 45 },
                grid: { color: 'rgba(75, 85, 99, 0.5)' }
            },
            y: {
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(75, 85, 99, 0.5)' }
            }
        }
    };
    
    new Chart(priceChartCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                { label: 'Price', data: chartData.price, borderColor: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.1)', tension: 0.1, fill: true, pointRadius: 0 },
                { label: '20-DMA', data: chartData.dma20, borderColor: '#facc15', tension: 0.1, pointRadius: 0 },
                { label: '50-DMA', data: chartData.dma50, borderColor: '#f87171', tension: 0.1, pointRadius: 0 }
            ]
        },
        options: chartOptionsBase
    });

    new Chart(oscillatorsChartCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                { label: 'RSI', data: chartData.rsi, borderColor: '#a78bfa', tension: 0.1, pointRadius: 0, yAxisID: 'yRSI' },
                { label: 'MACD', data: chartData.macd, borderColor: '#34d399', tension: 0.1, pointRadius: 0, yAxisID: 'yMACD' },
                { label: 'MACD Signal', data: chartData.macdSignal, borderColor: '#fb923c', borderDash: [5, 5], tension: 0.1, pointRadius: 0, yAxisID: 'yMACD' }
            ]
        },
        options: {
            ...chartOptionsBase,
            scales: {
              x: { ...chartOptionsBase.scales.x },
              yRSI: { type: 'linear', position: 'left', min: 0, max: 100, ticks: { color: '#a78bfa' }, grid: { drawOnChartArea: false } },
              yMACD: { type: 'linear', position: 'right', ticks: { color: '#34d399' }, grid: { color: 'rgba(75, 85, 99, 0.5)' } }
            }
        }
    });
}