const axios = require('axios'); // eslint-disable-line no-unused-vars

/**
 * Step 2: API Data Collection
 * Simulates pulling real-time market trend and competitor data for a given idea.
 *
 * Swap the mock logic below for real calls, e.g.:
 * - Google Trends (via SerpApi) for search interest over time
 * - Crunchbase / ProductHunt API for competitor discovery
 * - NewsAPI for recent news/sentiment signals
 *
 * Example of what a real call might look like:
 *   const res = await axios.get('https://api.example.com/trends', {
 *     params: { q: idea.title, apiKey: process.env.MARKET_API_KEY },
 *   });
 *//**
 * Step 2: API Data Collection
 * Generates market data and useful research links for each startup idea.
 */

async function getMarketData(idea) {
  const trendScore = Math.round(50 + Math.random() * 50); // 50-100

  const competitionLevels = ['Low', 'Medium', 'High'];
  const competitionLevel =
    competitionLevels[Math.floor(Math.random() * competitionLevels.length)];

  const estimatedMarketSizeUSD = Math.round(
    (Math.random() * 9 + 1) * 1e8
  ); // $100M-$1B

  const firstWord = idea.title.split(' ')[0];

  const competitors = [
    `${firstWord}Base`,
    `${firstWord}Hub`,
    `Get${firstWord}`,
  ];

  return {
    trendScore,
    competitionLevel,
    estimatedMarketSizeUSD,
    competitors,
  };
}

module.exports = { getMarketData };
