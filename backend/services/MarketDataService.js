/**
 * MarketDataService.js
 * Generates realistic NIFTY 50 historical price data.
 * Uses a seeded random walk so the chart looks consistent and natural.
 */

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  s = (s * 16807) % 2147483647;
  return (s - 1) / 2147483646;
}

function generateNiftyHistory(months = 12) {
  const points = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - months);

  // Start around a realistic NIFTY 50 level
  let price = 24800;
  const baseSeed = 42;

  const current = new Date(startDate);
  let dayIndex = 0;

  while (current <= now) {
    // Skip weekends
    const dow = current.getDay();
    if (dow !== 0 && dow !== 6) {
      const dateSeed = baseSeed + current.getFullYear() * 10000 + (current.getMonth() + 1) * 100 + current.getDate();
      const r = seededRandom(dateSeed);

      // Simulate realistic daily movement (-1.5% to +1.5%)
      const dailyChange = (r - 0.48) * 0.025; // slight downward bias to create the dip pattern
      price = price * (1 + dailyChange);

      // Add some trend: gentle decline mid-year, partial recovery
      const monthProgress = dayIndex / (months * 22); // ~22 trading days per month
      const trendBias = Math.sin(monthProgress * Math.PI * 2 - Math.PI / 3) * 15;
      price += trendBias;

      // Clamp to realistic range
      price = Math.max(18000, Math.min(28000, price));

      points.push({
        date: current.toISOString().split("T")[0],
        timestamp: Math.floor(current.getTime() / 1000),
        price: Math.round(price * 100) / 100,
      });

      dayIndex++;
    }

    current.setDate(current.getDate() + 1);
  }

  return points;
}

function getMarketOverview(range = "1Y") {
  let months;
  switch (range) {
    case "1M":
      months = 1;
      break;
    case "3M":
      months = 3;
      break;
    case "6M":
      months = 6;
      break;
    case "1Y":
    default:
      months = 12;
      break;
  }

  const niftyData = generateNiftyHistory(months);

  return {
    index: "NIFTY 50",
    data: niftyData,
    currentPrice: niftyData.length > 0 ? niftyData[niftyData.length - 1].price : 0,
    change: niftyData.length >= 2
      ? Math.round((niftyData[niftyData.length - 1].price - niftyData[0].price) * 100) / 100
      : 0,
    changePercent: niftyData.length >= 2
      ? Math.round(((niftyData[niftyData.length - 1].price - niftyData[0].price) / niftyData[0].price) * 10000) / 100
      : 0,
  };
}

module.exports = { getMarketOverview };
