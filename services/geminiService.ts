import { GoogleGenAI, Type } from '@google/genai';

// Initialize GoogleGenAI with apiKey property
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Use a recommended model
const model = 'gemini-2.5-flash';

/**
 * Extracts a JSON string from a text that might contain markdown backticks and other text.
 * @param {string} text The text to extract JSON from.
 * @returns {string | null} The extracted JSON string or null if not found.
 */
function extractJsonFromText(text) {
    // First, try to find a JSON block marked with ```json
    const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
        return jsonBlockMatch[1].trim();
    }

    // If no block is found, find the first '{' or '[' and the last '}' or ']'
    // This is a fallback for cases where the model doesn't use markdown.
    const firstBrace = text.indexOf('{');
    const firstBracket = text.indexOf('[');
    
    let startIndex;
    
    // Find the first occurrence of either '{' or '['
    if (firstBrace === -1) {
        startIndex = firstBracket;
    } else if (firstBracket === -1) {
        startIndex = firstBrace;
    } else {
        startIndex = Math.min(firstBrace, firstBracket);
    }

    if (startIndex === -1) {
        return null; // No JSON structure found
    }

    // Find the last occurrence of either '}' or ']'
    const lastBrace = text.lastIndexOf('}');
    const lastBracket = text.lastIndexOf(']');
    const endIndex = Math.max(lastBrace, lastBracket);

    if (endIndex === -1 || endIndex < startIndex) {
        return null; // No valid closing tag found
    }

    return text.substring(startIndex, endIndex + 1);
}

const generatePrompt = (symbol, reportType) => {
  const isComparison = symbol.includes(',');
  const stockNoun = isComparison ? 'stocks' : 'stock';

  if (reportType === 'detailed') {
    return `
      Analyze the following Indian ${stockNoun} listed on NSE: ${symbol}.
      Provide a comprehensive, multi-faceted "Finsights" report.
      Use Google Search to fetch the latest stock data, news, and financial information.
      The report must be structured as a valid JSON object.
      ONLY return the JSON object. Do not add any conversational text before or after the JSON.
      The JSON object must have the following keys: "overview", "fundamentals", "technicals", "news", "sentiment", "strategy", and optionally "comparison".
      - "overview": { "companyName": string, "symbol": string, "description": string, "swot": { "strengths": string[], "weaknesses": string[], "opportunities": string[], "threats": string[] } }
      - "fundamentals": { "metrics": [{ "name": string, "value": string, "explanation": string }], "aiComment": string }. Include at least P/E Ratio, P/B Ratio, Debt to Equity, ROE, and Dividend Yield.
      - "technicals": { "chartData": { "labels": string[], "price": number[], "dma20": (number | null)[], "dma50": (number | null)[], "rsi": (number | null)[], "macd": (number | null)[], "macdSignal": (number | null)[] } | null, "indicators": [{ "name": string, "value": string, "signal": "Bullish" | "Bearish" | "Neutral", "explanation": string }], "aiComment": string }. chartData should be for the last 90 days.
      - "news": { "items": [{ "headline": string, "source": string, "impactAnalysis": string }] }. List top 3-4 recent news.
      - "sentiment": { "score": number (0-100), "label": string, "aiComment": string }
      - "strategy": { "strategyType": string, "timeHorizon": string, "entryZone": string, "targetPrice": string, "stopLoss": string, "riskLevel": string, "rationale": string, "keyLevels": { "support": string[], "resistance": string[] }, "positionSizingTip": string, "teachingTip": string }
      - "comparison" (only if multiple stocks): { "verdict": string, "table": string (HTML format for the table) }
      - All financial values should be in INR.
    `;
  }
  
  return `
    Provide a quick summary for the following Indian stock(s) listed on NSE: ${symbol}.
    Use Google Search to fetch the latest information.
    The output should be a valid JSON object with a 'summaryPoints' array of 3-5 strings.
    ONLY return the JSON object. Do not add any conversational text before or after the JSON.
  `;
};

export async function generateReport(symbol, reportType) {
  const prompt = generatePrompt(symbol, reportType);
  
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      // responseMimeType and responseSchema are not supported with tools
      tools: [{ googleSearch: {} }],
    },
  });
  
  const rawText = response.text.trim();
  const jsonText = extractJsonFromText(rawText);

  if (!jsonText) {
    console.error("Could not extract JSON from generateReport response:", rawText);
    throw new Error("The AI model returned an invalid data format for the report.");
  }
  
  try {
      const data = JSON.parse(jsonText);
      if (reportType === 'detailed') {
        return { ...data, mode: 'detailed' };
      }
      return { ...data, mode: 'summary' };
  } catch(e) {
      console.error("Failed to parse JSON from generateReport response:", jsonText);
      throw new Error("The AI model returned an invalid data format for the report.");
  }
}

export async function getMarketMovers() {
    const prompt = `
        Get the top 5 NIFTY 50 gainers and top 5 NIFTY 50 losers for today.
        Use Google Search to fetch the latest market data.
        Return the result as a valid JSON object with two keys: "gainers" and "losers".
        Each key should hold an array of objects, where each object has "symbol", "ltp", and "changePercent".
        The 'changePercent' for losers should be a negative number.
        ONLY return the JSON object. Do not add any conversational text before or after the JSON.
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            // responseMimeType and responseSchema are not supported with tools
            tools: [{ googleSearch: {} }],
        },
    });

    const rawText = response.text.trim();
    const jsonText = extractJsonFromText(rawText);

    if (!jsonText) {
        console.error("Could not extract JSON from getMarketMovers response:", rawText);
        throw new Error("The AI model returned an invalid data format for market movers.");
    }

    try {
        return JSON.parse(jsonText);
    } catch(e) {
        console.error("Failed to parse JSON from getMarketMovers response:", jsonText);
        throw new Error("The AI model returned an invalid data format for market movers.");
    }
}

export async function runStockScreener(criteria) {
    const prompt = `
        Run a stock screener for Indian stocks on the NSE based on these criteria:
        - Market Cap between ${criteria.marketCapMin} Cr and ${criteria.marketCapMax} Cr INR.
        - P/E Ratio between ${criteria.peRatioMin} and ${criteria.peRatioMax}.
        - Dividend Yield greater than ${criteria.dividendYieldMin}%.
        - Analyst Rating: ${criteria.analystRating === 'all' ? 'Any' : criteria.analystRating.replace('-', ' ')}.
        
        Use Google Search to find up to 10 stocks that meet these conditions.
        Return the result as a valid JSON array. Each object in the array should contain: "symbol", "companyName", "ltp", "marketCap", "peRatio", and "dividendYield".
        If no stocks are found, return an empty JSON array.
        ONLY return the JSON array. Do not add any conversational text before or after the JSON.
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            // responseMimeType and responseSchema are not supported with tools
            tools: [{ googleSearch: {} }],
        },
    });

    const rawText = response.text.trim();
    const jsonText = extractJsonFromText(rawText);

    if (!jsonText) {
        console.error("Could not extract JSON from runStockScreener response:", rawText);
        throw new Error("The AI model returned an invalid data format for the stock screener.");
    }
    
    try {
        return JSON.parse(jsonText);
    } catch(e) {
        console.error("Failed to parse JSON from runStockScreener response:", jsonText);
        throw new Error("The AI model returned an invalid data format for the stock screener.");
    }
}

export async function getWatchlistPerformance(symbols) {
    if (!symbols || symbols.length < 2) {
        return null;
    }
    
    const prompt = `
        Analyze the collective performance of the following Indian stocks listed on the NSE: ${symbols.join(', ')}.
        Use Google Search to get the daily closing prices for each stock for the last 30 calendar days.
        
        Follow these steps for calculation:
        1. For each stock, calculate its percentage change relative to its price on day 1 (the earliest date).
        2. For each day, calculate the simple average of these percentage changes across all stocks.
        
        Return the result as a single, valid JSON object with two keys: "labels" and "data".
        - "labels": An array of strings representing the dates for the last 30 days (e.g., "YYYY-MM-DD").
        - "data": An array of numbers representing the calculated average percentage change for each corresponding date. The first value must be 0.
        
        ONLY return the JSON object. Do not add any conversational text before or after the JSON.
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const rawText = response.text.trim();
    const jsonText = extractJsonFromText(rawText);

    if (!jsonText) {
        console.error("Could not extract JSON from getWatchlistPerformance response:", rawText);
        throw new Error("The AI model returned an invalid data format for watchlist performance.");
    }

    try {
        const parsed = JSON.parse(jsonText);
        if (!parsed.labels || !parsed.data) {
             throw new Error("Missing 'labels' or 'data' in watchlist performance response.");
        }
        return parsed;
    } catch(e) {
        console.error("Failed to parse JSON from getWatchlistPerformance response:", jsonText, e);
        throw new Error("The AI model returned an invalid data format for watchlist performance.");
    }
}

const learnTopicPrompts = {
    'pe_ratio': 'Explain the Price-to-Earnings (P/E) Ratio to a complete beginner in finance. Cover what it is, how it is calculated, what a high or low P/E might indicate, and its limitations. Use a simple analogy.',
    'debt_equity': 'Explain the Debt-to-Equity (D/E) Ratio for someone new to investing. Describe what it measures, the formula, and what different D/E levels might mean for a company\'s risk.',
    'roe': 'Explain Return on Equity (ROE) in simple terms. What does it tell an investor about a company? How is it calculated, and what is considered a good ROE?',
    'dividend_yield': 'Explain Dividend Yield to a beginner. What is it, how is it calculated, and why might an investor be interested in it? Mention the trade-off between growth and dividends.',
    'moving_average': 'Explain what a Moving Average (MA) is in stock technical analysis. Describe the difference between a Simple Moving Average (SMA) and an Exponential Moving Average (EMA). Explain how traders use them, including the concept of a "Golden Cross" and "Death Cross".',
    'rsi': 'Explain the Relative Strength Index (RSI) to a new trader. What does it measure? What do "overbought" and "oversold" conditions mean (e.g., above 70 and below 30)? How can it be used to spot potential trend reversals?',
    'macd': 'Explain the MACD (Moving Average Convergence Divergence) indicator in a simple way. Describe its components (MACD line, signal line, histogram) and how traders interpret crossovers and the histogram.',
    'support_resistance': 'Explain the concepts of Support and Resistance in technical analysis. Use an analogy like a floor and a ceiling. Describe how these levels are identified and why they are important for traders.',
    'diversification': 'Explain the importance of diversification in investing for a beginner. Use the "don\'t put all your eggs in one basket" analogy. Describe how an investor can diversify their portfolio across different asset classes and sectors.',
    'market_cap': 'Explain Market Capitalization (Market Cap) in simple terms. What is it, how is it calculated, and what do the categories (Large-Cap, Mid-Cap, Small-Cap) mean for an investor in terms of risk and growth potential?',
};

export async function getLearnTopicContent(topicId) {
    const topicPrompt = learnTopicPrompts[topicId];
    if (!topicPrompt) {
        throw new Error(`Invalid learn topic ID: ${topicId}`);
    }

    const fullPrompt = `
        ${topicPrompt}
        Please structure your response as a valid JSON object with two keys: "title" and "content".
        The "title" should be the name of the concept (e.g., "Price-to-Earnings (P/E) Ratio").
        The "content" should be the explanation in well-formatted HTML. Use paragraphs (<p>), bold tags (<strong>), lists (<ul><li>), and italics (<em>) to make it easy to read.
        ONLY return the JSON object. Do not add any conversational text before or after the JSON.
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING }
                },
                required: ["title", "content"]
            }
        },
    });

    const rawText = response.text.trim();
    // No need for extractJsonFromText here due to responseMimeType
    try {
        const parsed = JSON.parse(rawText);
        if (!parsed.title || !parsed.content) {
             throw new Error("Missing 'title' or 'content' in learn topic response.");
        }
        return parsed;
    } catch(e) {
        console.error("Failed to parse JSON from getLearnTopicContent response:", rawText, e);
        throw new Error("The AI model returned an invalid data format for the learn topic.");
    }
}