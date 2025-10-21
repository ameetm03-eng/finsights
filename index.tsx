import { generateReport, getMarketMovers, runStockScreener, getWatchlistPerformance, getLearnTopicContent } from './services/geminiService.js';
import { createAppUI } from './App.js';
import { initializeCharts } from './components/dashboard/TechnicalsTab.js';
import { initializeWatchlistChart } from './components/watchlist/WatchlistPerformance.js';

// --- APPLICATION STATE ---
const state = {
  // App Core State
  report: null,
  isLoading: false,
  error: null,
  activeAppTab: 'analyzer',
  // Authentication State
  user: null, // Example: { name: 'Jane Doe' }
  isLoginModalOpen: false,
  // Market Movers State
  marketGainers: [],
  marketLosers: [],
  isMarketLoading: true,
  marketError: null,
  marketMoversActiveTab: 'gainers',
  // Dashboard State
  dashboardActiveTab: 'Overview',
  // Screener state
  screenerCriteria: {
    marketCapMin: 5000,
    marketCapMax: 500000,
    peRatioMin: 0,
    peRatioMax: 50,
    dividendYieldMin: 1,
    analystRating: 'buy',
  },
  screenerResults: [],
  isScreenerLoading: false,
  screenerError: null,
  hasScreenerRun: false,
  // Watchlist & Alerts State
  watchlist: [],
  triggeredAlerts: [],
  watchlistPerformanceData: null,
  isWatchlistPerformanceLoading: false,
  watchlistPerformanceError: null,
  // Learn State
  learnModalTopic: null,
  learnContent: {},
  isLearnContentLoading: false,
  learnContentError: null,
};

// --- STATE MANAGEMENT ---
function setState(newState) {
  Object.assign(state, newState);
  render();
}

// --- AUTHENTICATION MANAGEMENT ---
const USER_SESSION_KEY = 'finsightsUserSession';

function loadUserSession() {
    try {
        const savedUser = localStorage.getItem(USER_SESSION_KEY);
        if (savedUser) {
            state.user = JSON.parse(savedUser);
        }
    } catch (e) {
        console.error("Could not load user session", e);
        state.user = null;
    }
}

function handleLogin(name) {
    if (!name.trim()) return;
    const user = { name: name.trim() };
    setState({ user, isLoginModalOpen: false });
    try {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } catch(e) {
        console.error("Could not save user session", e);
    }
    loadWatchlist(); // Reload watchlist for the new user
}

function handleLogout() {
    setState({ user: null });
    localStorage.removeItem(USER_SESSION_KEY);
    loadWatchlist(); // Reload guest watchlist
}

// --- WATCHLIST MANAGEMENT ---
const getWatchlistKey = () => {
    // Use a different storage key for logged-in users vs guests
    const identifier = state.user?.name ? state.user.name.replace(/\s+/g, '_') : 'guest';
    return `finsightsWatchlist_${identifier}`;
};


function loadWatchlist() {
    try {
        const saved = localStorage.getItem(getWatchlistKey());
        const watchlist = saved ? JSON.parse(saved).map(item => ({...item, alertPrice: item.alertPrice || null})) : [];
        setState({ watchlist });
    } catch (e) {
        console.error("Could not load watchlist from localStorage", e);
        setState({ watchlist: [] });
    }
}

function saveWatchlist() {
    try {
        localStorage.setItem(getWatchlistKey(), JSON.stringify(state.watchlist));
    } catch (e) {
        console.error("Could not save watchlist to localStorage", e);
    }
}

function addToWatchlist(symbol, companyName) {
    if (!state.watchlist.some(item => item.symbol === symbol)) {
        const newWatchlist = [...state.watchlist, { symbol, companyName, alertPrice: null }];
        setState({ watchlist: newWatchlist });
        saveWatchlist();
        if (state.activeAppTab === 'watchlist') {
            fetchWatchlistPerformance();
        }
    }
}

function removeFromWatchlist(symbol) {
    const newWatchlist = state.watchlist.filter(item => item.symbol !== symbol);
    setState({ watchlist: newWatchlist });
    saveWatchlist();
    if (state.activeAppTab === 'watchlist') {
        fetchWatchlistPerformance();
    }
}

function setPriceAlert(symbol, price) {
    const newWatchlist = state.watchlist.map(item => {
        if (item.symbol === symbol) {
            return { ...item, alertPrice: price };
        }
        return item;
    });
    setState({ watchlist: newWatchlist });
    saveWatchlist();
}

function removePriceAlert(symbol) {
    const newWatchlist = state.watchlist.map(item => {
        if (item.symbol === symbol) {
            return { ...item, alertPrice: null };
        }
        return item;
    });
    setState({ watchlist: newWatchlist });
    saveWatchlist();
}

function dismissAlert(symbol) {
    const newAlerts = state.triggeredAlerts.filter(alert => alert.symbol !== symbol);
    setState({ triggeredAlerts: newAlerts });
}

// --- WATCHLIST PERFORMANCE ---
async function fetchWatchlistPerformance() {
    if (state.watchlist.length < 2) {
        return setState({ watchlistPerformanceData: null, watchlistPerformanceError: null });
    }
    setState({ isWatchlistPerformanceLoading: true, watchlistPerformanceError: null });
    try {
        const symbols = state.watchlist.map(s => s.symbol);
        const performanceData = await getWatchlistPerformance(symbols);
        setState({ watchlistPerformanceData: performanceData, isWatchlistPerformanceLoading: false });
    } catch (err) {
        console.error("Failed to fetch watchlist performance:", err);
        setState({
            watchlistPerformanceError: "Could not load watchlist performance data. The model may be busy.",
            isWatchlistPerformanceLoading: false,
        });
    }
}

// --- LEARN TOPICS ---
async function fetchLearnTopicContent(topicId) {
    if (state.learnContent[topicId]) {
        return; // Already cached
    }

    setState({ isLearnContentLoading: true, learnContentError: null });

    try {
        const content = await getLearnTopicContent(topicId);
        const newLearnContent = { ...state.learnContent, [topicId]: content };
        setState({
            learnContent: newLearnContent,
            isLearnContentLoading: false,
        });
    } catch (err) {
        console.error(`Failed to fetch learn topic "${topicId}":`, err);
        setState({
            learnContentError: "Could not load the explanation. The AI model might be busy. Please try again.",
            isLearnContentLoading: false,
        });
    }
}


// --- RENDER FUNCTION ---
function render() {
  const root = document.getElementById('root');
  if (!root) {
    console.error("Root element not found");
    return;
  }
  
  root.innerHTML = createAppUI(state);
  
  if (state.activeAppTab === 'analyzer' && state.report && state.report.mode === 'detailed' && state.dashboardActiveTab === 'Technicals') {
    initializeCharts(state.report.technicals);
  }
  if (state.activeAppTab === 'watchlist' && state.watchlistPerformanceData) {
      initializeWatchlistChart(state.watchlistPerformanceData);
  }
}

// --- EVENT HANDLING ---
function setupEventListeners() {
  const root = document.getElementById('root');
  if (!root) return;

  root.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      if (!button) return;

      // Auth actions
      if (button.id === 'open-login-modal-btn') return setState({ isLoginModalOpen: true });
      if (button.id === 'logout-btn') return handleLogout();
      if (button.id === 'close-login-modal-btn' || target.id === 'login-modal-overlay') {
        return setState({ isLoginModalOpen: false });
      }

      // Main App Tabs
      if (button.id === 'analyzer-tab-btn') return setState({ activeAppTab: 'analyzer', dashboardActiveTab: 'Overview' });
      if (button.id === 'screener-tab-btn') return setState({ activeAppTab: 'screener' });
      if (button.id === 'learn-tab-btn') return setState({ activeAppTab: 'learn' });
      if (button.id === 'watchlist-tab-btn') {
          setState({ activeAppTab: 'watchlist' });
          fetchWatchlistPerformance();
          return;
      }

      // Dashboard tabs
      if (button.classList.contains('dashboard-tab-btn')) {
          const tabName = button.dataset.tab;
          if (tabName) return setState({ dashboardActiveTab: tabName });
      }

      // Market movers
      if (button.id === 'market-movers-refresh') return fetchMarketMovers();
      if (button.id === 'gainers-tab-btn') return setState({ marketMoversActiveTab: 'gainers' });
      if (button.id === 'losers-tab-btn') return setState({ marketMoversActiveTab: 'losers' });
      
      // Watchlist actions
      if (button.id === 'add-to-watchlist-btn') {
          const { symbol, name } = button.dataset;
          return addToWatchlist(symbol, name);
      }
      if (button.id === 'remove-from-watchlist-btn' || button.classList.contains('remove-from-watchlist-btn')) {
           const { symbol } = button.dataset;
           return removeFromWatchlist(symbol);
      }
      if (button.classList.contains('remove-alert-btn')) {
          const { symbol } = button.dataset;
          if (symbol) return removePriceAlert(symbol);
      }
      if (button.classList.contains('dismiss-alert-btn')) {
          const { symbol } = button.dataset;
          if (symbol) return dismissAlert(symbol);
      }

      // Learn actions
      if (button.classList.contains('learn-topic-card')) {
          const topicId = button.dataset.topicId;
          if (topicId) {
              setState({ learnModalTopic: topicId });
              fetchLearnTopicContent(topicId);
          }
          return;
      }
       if (button.id === 'close-learn-modal-btn' || target.id === 'learn-modal-overlay') {
        return setState({ learnModalTopic: null, learnContentError: null });
      }
  });

  root.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      if (form.id === 'stock-input-form') {
          handleAnalysisSubmit(e);
      } else if (form.id === 'stock-screener-form') {
          handleScreenerSubmit(e);
      } else if (form.id === 'login-form') {
          const formData = new FormData(form);
          const nameValue = formData.get('name');
          const name = typeof nameValue === 'string' ? nameValue : '';
          handleLogin(name);
      } else if (form.classList.contains('watchlist-alert-form')) {
          const symbol = form.dataset.symbol;
          const formData = new FormData(form);
          const priceValue = formData.get('price');
          const price = typeof priceValue === 'string' ? parseFloat(priceValue) : NaN;
          if (symbol && !isNaN(price) && price > 0) {
              setPriceAlert(symbol, price);
          }
      }
  });
  
  root.addEventListener('change', (e) => {
    const target = e.target as HTMLElement;
    if(target.closest('#stock-screener-form')) {
        handleScreenerCriteriaChange(e);
    }
  });
}

// --- LOGIC / HANDLERS ---
async function handleAnalysisSubmit(e) {
  const formData = new FormData(e.target as HTMLFormElement);
  const symbolValue = formData.get('symbol');
  const symbol = typeof symbolValue === 'string' ? symbolValue.trim() : '';
  const reportType = formData.get('reportType');

  if (!symbol) return;

  setState({ isLoading: true, error: null, report: null });
  try {
    const result = await generateReport(symbol, reportType);
    setState({ report: result, isLoading: false, dashboardActiveTab: 'Overview' });
  } catch (err) {
    console.error(err);
    setState({ error: 'An error occurred while generating the report. The model might be overloaded. Please try again in a moment.', isLoading: false });
  }
}

function checkPriceAlerts(gainers, losers) {
    const prices = new Map();
    [...gainers, ...losers].forEach(stock => {
        prices.set(stock.symbol.toUpperCase(), stock.ltp);
    });

    const existingAlertSymbols = new Set(state.triggeredAlerts.map(a => a.symbol));
    const newAlerts = [];

    state.watchlist.forEach(stock => {
        if (stock.alertPrice && !existingAlertSymbols.has(stock.symbol)) {
            const currentPrice = prices.get(stock.symbol.toUpperCase());
            if (currentPrice) {
                if (currentPrice >= stock.alertPrice) {
                    newAlerts.push({
                        symbol: stock.symbol,
                        companyName: stock.companyName,
                        targetPrice: stock.alertPrice,
                        currentPrice: currentPrice,
                    });
                }
            }
        }
    });

    if (newAlerts.length > 0) {
        setState({ triggeredAlerts: [...state.triggeredAlerts, ...newAlerts] });
    }
}

async function fetchMarketMovers() {
  setState({ isMarketLoading: true, marketError: null });
  try {
    const { gainers, losers } = await getMarketMovers();
    setState({ marketGainers: gainers, marketLosers: losers, isMarketLoading: false });
    checkPriceAlerts(gainers, losers);
  } catch (err) {
    console.error("Failed to fetch market movers:", err);
    setState({ 
      marketError: "Could not load market movers. This might be due to an API issue or an invalid API key. Please check your setup and try again.", 
      isMarketLoading: false 
    });
  }
}

function handleScreenerCriteriaChange(e) {
    const { name, value } = (e.target as HTMLInputElement);
    const newCriteria = { ...state.screenerCriteria };
    newCriteria[name] = name.includes('Min') || name.includes('Max') || name.includes('peRatio') || name.includes('dividendYield') ? parseFloat(value) : value;
    state.screenerCriteria = newCriteria;
}

async function handleScreenerSubmit(e) {
    setState({ isScreenerLoading: true, screenerError: null, screenerResults: [], hasScreenerRun: true });
    try {
        const screenerResults = await runStockScreener(state.screenerCriteria);
        setState({ screenerResults, isScreenerLoading: false });
    } catch (err) {
        setState({ screenerError: 'Failed to run screener. The AI model may be busy. Please try again.', isScreenerLoading: false });
        console.error(err);
    }
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  loadUserSession();
  loadWatchlist();
  setupEventListeners();
  render();
  fetchMarketMovers();
});