const { sequelize } = require("../models");
const { calculateUserAccountValue } = require("./AccountValueService");

// Track last broadcast values and throttle timers per user
const lastEmittedValue = new Map();
const userThrottleTimers = new Map();
const THROTTLE_INTERVAL_MS = 250; // Max 4 messages per second per user

/**
 * Call this function whenever a Stock price updates!
 * Finds impacted users holding that stock and broadcasts updated total account value.
 */
async function onStockPriceChange(stockId, io) {
  try {
    // Find all users who hold open positions in this stock
    const query = `
      SELECT DISTINCT "userId" 
      FROM "ActiveStocks" 
      WHERE "stockId" = :stockId;
    `;
    const users = await sequelize.query(query, {
      replacements: { stockId },
      type: sequelize.QueryTypes.SELECT,
    });

    for (const user of users) {
      const userId = user.userId;

      // Throttle updates per user
      if (!userThrottleTimers.has(userId)) {
        userThrottleTimers.set(
          userId,
          setTimeout(async () => {
            userThrottleTimers.delete(userId);

            const currentValue = await calculateUserAccountValue(userId);
            const prevValue = lastEmittedValue.get(userId);

            // Send only if value has changed
            if (prevValue !== currentValue) {
              lastEmittedValue.set(userId, currentValue);
              const payload = {
                time: Math.floor(Date.now() / 1000),
                value: currentValue,
              };
              // Emit live update to user's room
              io.to(`user:${userId}`).emit("accountValueUpdate", payload);
            }
          }, THROTTLE_INTERVAL_MS)
        );
      }
    }
  } catch (err) {
    console.error("Error broadcasting live account value:", err);
  }
}

module.exports = { onStockPriceChange };
