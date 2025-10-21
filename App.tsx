
import { Header } from './components/Header.js';
import { StockInputForm } from './components/StockInputForm.js';
import { Dashboard } from './components/dashboard/Dashboard.js';
import { Footer } from './components/Footer.js';
import { MarketMovers } from './components/MarketMovers.js';
import { WarningIcon } from './components/icons/WarningIcon.js';
import { AppTabs } from './components/AppTabs.js';
import { StockScreener } from './components/StockScreener.js';
import { Watchlist } from './components/Watchlist.js';
import { AlertNotifications } from './components/AlertNotifications.js';
import { LoginModal } from './components/LoginModal.js';
import { Learn } from './components/learn/Learn.js';
import { LearnModal } from './components/learn/LearnModal.js';

function createErrorDisplay(error) {
  if (!error) return '';
  return `
    <div class="mt-6 flex items-center p-4 bg-red-900/30 border border-red-700/50 text-red-300 rounded-lg">
      ${WarningIcon({ className: "w-6 h-6 mr-3 flex-shrink-0" })}
      <span>${error}</span>
    </div>
  `;
}

export function createAppUI(state) {
  const { 
    user,
    isLoginModalOpen,
    activeAppTab, 
    error, 
    isLoading, 
    report, 
    marketGainers, 
    marketLosers, 
    isMarketLoading, 
    marketError,
    marketMoversActiveTab,
    dashboardActiveTab,
    screenerCriteria,
    isScreenerLoading,
    screenerError,
    screenerResults,
    hasScreenerRun,
    watchlist,
    triggeredAlerts,
    watchlistPerformanceData,
    isWatchlistPerformanceLoading,
    watchlistPerformanceError,
    learnModalTopic,
    // FIX: Renamed the `learnContent` variable below to `learnTabViewContent` to avoid conflict.
    learnContent,
    isLearnContentLoading,
    learnContentError,
  } = state;

  const analyzerContent = `
    ${StockInputForm({ isLoading })}
    ${createErrorDisplay(error)}
    ${Dashboard({ report, isLoading, activeTab: dashboardActiveTab, watchlist })}
    ${MarketMovers({ 
      gainers: marketGainers, 
      losers: marketLosers, 
      isLoading: isMarketLoading,
      error: marketError,
      activeTab: marketMoversActiveTab,
    })}
  `;
  
  const screenerContent = StockScreener({
    criteria: screenerCriteria,
    isLoading: isScreenerLoading,
    error: screenerError,
    results: screenerResults,
    hasRun: hasScreenerRun,
  });

  const watchlistContent = Watchlist({ 
    watchlist, 
    user,
    performanceData: watchlistPerformanceData,
    isPerformanceLoading: isWatchlistPerformanceLoading,
    performanceError: watchlistPerformanceError,
  });

  // FIX: Renamed from learnContent to avoid redeclaration error.
  const learnTabViewContent = Learn();

  const getMainContent = () => {
    switch (activeAppTab) {
        case 'analyzer': return analyzerContent;
        case 'screener': return screenerContent;
        case 'watchlist': return watchlistContent;
        case 'learn': return learnTabViewContent;
        default: return analyzerContent;
    }
  }

  return `
    <div class="bg-gray-900 text-gray-200 min-h-screen flex flex-col font-sans">
      ${Header({ user })}
      <main class="container mx-auto px-4 py-8 flex-grow w-full max-w-4xl">
        ${AppTabs({ activeAppTab })}
        ${AlertNotifications({ alerts: triggeredAlerts })}
        ${getMainContent()}
      </main>
      ${Footer()}
      ${isLoginModalOpen ? LoginModal() : ''}
      ${learnModalTopic ? LearnModal({ 
          topicId: learnModalTopic,
          isLoading: isLearnContentLoading,
          error: learnContentError,
          topicData: learnContent[learnModalTopic]
      }) : ''}
    </div>
  `;
}