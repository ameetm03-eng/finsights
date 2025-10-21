import { LoadingSpinner } from '../LoadingSpinner.js';
import { Tabs } from './Tabs.js';
import { OverviewTab } from './OverviewTab.js';
import { FundamentalsTab } from './FundamentalsTab.js';
import { TechnicalsTab } from './TechnicalsTab.js';
import { NewsTab } from './NewsTab.js';
import { SentimentTab } from './SentimentTab.js';
import { StrategyTab } from './StrategyTab.js';
import { ComparisonTab } from './ComparisonTab.js';
import { SummaryView } from './SummaryView.js';

export const Dashboard = ({ report, isLoading, activeTab, watchlist }) => {

  if (isLoading) {
    return `
      <div class="mt-8 text-center p-10 bg-gray-800/60 rounded-xl border border-gray-700">
        ${LoadingSpinner()}
        <p class="mt-4 text-gray-400">Stock Mentor AI is analyzing... This may take a moment.</p>
      </div>
    `;
  }

  if (!report) {
    return '';
  }
  
  if (report.mode === 'summary') {
    return SummaryView({ summaryPoints: report.summaryPoints });
  }

  const TABS = ['Overview', 'Fundamentals', 'Technicals', 'News', 'Sentiment', 'Strategy'];
  if (report.comparison) {
    TABS.push('Comparison');
  }
  
  let tabContent = '';
  switch(activeTab) {
    case 'Overview':
      tabContent = OverviewTab({ data: report.overview, watchlist });
      break;
    case 'Fundamentals':
      tabContent = FundamentalsTab({ data: report.fundamentals });
      break;
    case 'Technicals':
      tabContent = TechnicalsTab({ data: report.technicals });
      break;
    case 'News':
      tabContent = NewsTab({ data: report.news });
      break;
    case 'Sentiment':
      tabContent = SentimentTab({ data: report.sentiment });
      break;
    case 'Strategy':
      tabContent = StrategyTab({ data: report.strategy });
      break;
    case 'Comparison':
      if (report.comparison) {
        tabContent = ComparisonTab({ data: report.comparison });
      }
      break;
    default:
      tabContent = OverviewTab({ data: report.overview, watchlist });
  }

  return `
    <div class="mt-8 bg-gray-800/60 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
      ${Tabs({ tabs: TABS, activeTab })}
      <div class="p-6 prose prose-invert prose-sm sm:prose-base max-w-none">
        ${tabContent}
        <p class="mt-8 text-xs text-gray-500 italic">Disclaimer: AI-generated insights. Not financial advice.</p>
      </div>
    </div>
  `;
};