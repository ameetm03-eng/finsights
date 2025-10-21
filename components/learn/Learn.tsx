
import { BookOpenIcon } from '../icons/BookOpenIcon.js';
import { ChartBarIcon } from '../icons/ChartBarIcon.js';
import { BriefcaseIcon } from '../icons/BriefcaseIcon.js';

const LearnTopicCard = ({ topicId, title, description, icon }) => `
    <button
        data-topic-id="${topicId}"
        class="learn-topic-card text-left w-full h-full p-6 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-cyan-500 hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
    >
        <div class="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg mb-4">
            ${icon({ className: "w-6 h-6 text-cyan-400"})}
        </div>
        <h3 class="font-bold text-gray-100">${title}</h3>
        <p class="text-sm text-gray-400 mt-1">${description}</p>
    </button>
`;

const LearnCategory = ({ title, children }) => `
    <section>
        <h2 class="text-2xl font-bold text-gray-200 mb-4">${title}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${children}
        </div>
    </section>
`;

export const Learn = () => {
  return `
    <div class="space-y-10">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-cyan-400">
                Finsights Learning Center
            </h1>
            <p class="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
                Your beginner-friendly guide to understanding the stock market. Click any topic to get a simple, AI-powered explanation.
            </p>
        </div>

        ${LearnCategory({
          title: "Fundamental Analysis",
          children: `
            ${LearnTopicCard({
              topicId: 'pe_ratio',
              title: "P/E Ratio",
              description: "Learn how to value a company based on its earnings.",
              icon: BookOpenIcon
            })}
            ${LearnTopicCard({
              topicId: 'debt_equity',
              title: "Debt-to-Equity Ratio",
              description: "Understand a company's financial leverage and risk.",
              icon: BookOpenIcon
            })}
            ${LearnTopicCard({
              topicId: 'roe',
              title: "Return on Equity (ROE)",
              description: "Measure how effectively a company generates profit.",
              // FIX: Corrected typo from BookOpenOpenIcon to BookOpenIcon.
              icon: BookOpenIcon
            })}
            ${LearnTopicCard({
              topicId: 'dividend_yield',
              title: "Dividend Yield",
              description: "Discover how stocks can pay you back with dividends.",
              icon: BookOpenIcon
            })}
          `
        })}

        ${LearnCategory({
          title: "Technical Analysis",
          children: `
            ${LearnTopicCard({
              topicId: 'moving_average',
              title: "Moving Averages",
              description: "Identify trend directions and smooth out price action.",
              icon: ChartBarIcon
            })}
            ${LearnTopicCard({
              topicId: 'rsi',
              title: "RSI (Relative Strength Index)",
              description: "Gauge if a stock is overbought or oversold.",
              icon: ChartBarIcon
            })}
            ${LearnTopicCard({
              topicId: 'macd',
              title: "MACD Indicator",
              description: "Spot changes in momentum, strength, and direction of a trend.",
              icon: ChartBarIcon
            })}
            ${LearnTopicCard({
              topicId: 'support_resistance',
              title: "Support & Resistance",
              description: "Find key price levels where trends might pause or reverse.",
              icon: ChartBarIcon
            })}
          `
        })}

        ${LearnCategory({
          title: "General Investing",
          children: `
            ${LearnTopicCard({
              topicId: 'diversification',
              title: "Diversification",
              description: "The art of not putting all your eggs in one basket.",
              icon: BriefcaseIcon
            })}
            ${LearnTopicCard({
              topicId: 'market_cap',
              title: "Market Capitalization",
              description: "Understand company sizes: from small-caps to large-caps.",
              icon: BriefcaseIcon
            })}
          `
        })}
    </div>
  `;
};