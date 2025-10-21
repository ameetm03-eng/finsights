import { Chart } from 'chart.js';
import { LoadingSpinner } from '../LoadingSpinner.js';
import { ChartLineIcon } from '../icons/ChartLineIcon.js';
import { WarningIcon } from '../icons/WarningIcon.js';

export const WatchlistPerformance = ({ data, isLoading, error, hasEnoughStocks }) => {
  const renderContent = () => {
    if (isLoading) {
      return `
        <div class="flex flex-col items-center justify-center h-64">
          ${LoadingSpinner()}
          <p class="mt-2 text-sm text-gray-400">Calculating performance...</p>
        </div>
      `;
    }

    if (error) {
      return `
        <div class="flex flex-col items-center justify-center h-64 text-red-400 text-center">
            ${WarningIcon({className: "w-8 h-8 mx-auto"})}
            <p class="mt-2 font-semibold">Could not load performance chart</p>
            <p class="text-sm text-red-400/80">${error}</p>
        </div>
      `;
    }

    if (data && hasEnoughStocks) {
      return `
        <div class="h-64 not-prose">
          <canvas id="watchlist-performance-chart"></canvas>
        </div>
      `;
    }

    return `
      <div class="flex flex-col items-center justify-center h-64 text-center">
        ${ChartLineIcon({ className: "w-12 h-12 mx-auto text-gray-600" })}
        <h3 class="mt-4 text-lg font-semibold text-gray-300">Track Your Performance</h3>
        <p class="mt-1 text-sm text-gray-500">
          Add two or more stocks to your watchlist to visualize their collective performance over time.
        </p>
      </div>
    `;
  };

  return `
    <div class="p-6 bg-gray-800/60 rounded-xl border border-gray-700 shadow-lg">
      <h2 class="text-lg font-semibold text-gray-200 mb-4">Watchlist Performance (30 Days)</h2>
      ${renderContent()}
    </div>
  `;
};


export function initializeWatchlistChart(performanceData) {
    if (!performanceData) return;

    if (Chart.getChart('watchlist-performance-chart')) {
        Chart.getChart('watchlist-performance-chart').destroy();
    }
    
    const chartCtx = (document.getElementById('watchlist-performance-chart') as HTMLCanvasElement)?.getContext('2d');
    if (!chartCtx) return;

    const lastDataPoint = performanceData.data[performanceData.data.length - 1];
    const chartColor = lastDataPoint >= 0 ? '#4ade80' : '#f87171'; // green-400 or red-400

    const gradient = chartCtx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, `${chartColor}4D`); // 30% opacity
    gradient.addColorStop(1, `${chartColor}00`); // 0% opacity

    new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: performanceData.labels,
            datasets: [{
                label: 'Avg. Performance',
                data: performanceData.data,
                borderColor: chartColor,
                backgroundColor: gradient,
                tension: 0.2,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: chartColor,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1f2937', titleColor: '#d1d5db', bodyColor: '#d1d5db',
                    borderColor: '#4b5563', borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `Avg. Change: ${context.parsed.y.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { 
                        color: '#9ca3af',
                        maxRotation: 0,
                        minRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6,
                    },
                    grid: { color: 'rgba(75, 85, 99, 0.2)' }
                },
                y: {
                    ticks: { 
                        color: '#9ca3af',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: { color: 'rgba(75, 85, 99, 0.5)' }
                }
            }
        }
    });
}