export const ScreenerResultsTable = ({ results }) => {
  if (results.length === 0) {
    return `<p class="text-center text-gray-500 mt-8">No stocks matched your criteria.</p>`;
  }

  return `
    <div class="mt-6 overflow-x-auto bg-gray-800/60 rounded-xl border border-gray-700 shadow-lg">
      <table class="w-full text-left text-sm table-auto">
        <thead class="text-gray-400 uppercase bg-gray-700/50">
          <tr>
            <th scope="col" class="px-4 py-3">Symbol</th>
            <th scope="col" class="px-4 py-3">Company</th>
            <th scope="col" class="px-4 py-3 text-right">LTP (₹)</th>
            <th scope="col" class="px-4 py-3 text-right">Market Cap</th>
            <th scope="col" class="px-4 py-3 text-right">P/E Ratio</th>
            <th scope="col" class="px-4 py-3 text-right">Div. Yield (%)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          ${results.map(stock => `
            <tr class="hover:bg-gray-700/30">
              <td class="px-4 py-3 font-medium text-cyan-400 whitespace-nowrap">${stock.symbol}</td>
              <td class="px-4 py-3 text-gray-300">${stock.companyName}</td>
              <td class="px-4 py-3 text-right text-gray-200">${stock.ltp.toFixed(2)}</td>
              <td class="px-4 py-3 text-right text-gray-200">${stock.marketCap}</td>
              <td class="px-4 py-3 text-right text-gray-200">${stock.peRatio.toFixed(2)}</td>
              <td class="px-4 py-3 text-right text-gray-200">${stock.dividendYield.toFixed(2)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};
