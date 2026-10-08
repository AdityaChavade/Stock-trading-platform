const { sequelize, User, TodaysAccountValue } = require("../models");
const { Op } = require("sequelize");

/**
 * Calculates current account value using User.Funds + SUM(quantity * latestPrice)
 * Uses exact DECIMAL conversion and LEFT JOIN / COALESCE so users without positions return funds.
 */
async function calculateUserAccountValue(userId) {
  try {
    const user = await User.findByPk(userId);
    if (!user) return 0;

    // Check if ActiveStocks view query succeeds
    const query = `
      SELECT 
        CAST(u."Funds" AS DECIMAL(15, 2)) + 
        COALESCE(SUM(CAST(a.quantity AS DECIMAL(15, 2)) * CAST(a."latestPrice" AS DECIMAL(15, 2))), 0) AS "totalAccountValue"
      FROM "Users" u
      LEFT JOIN "ActiveStocks" a ON u.id = a."userId"
      WHERE u.id = :userId
      GROUP BY u.id, u."Funds";
    `;

    const results = await sequelize.query(query, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
    });

    if (results && results.length > 0) {
      return parseFloat(results[0].totalAccountValue);
    }
    return parseFloat(user.Funds || 0);
  } catch (error) {
    // Fallback if ActiveStocks view is not created in DB yet
    const user = await User.findByPk(userId);
    if (!user) return 0;

    const queryFallback = `
      SELECT COALESCE(SUM(CAST("Qty" AS DECIMAL(15, 2)) * CAST("LTP" AS DECIMAL(15, 2))), 0) AS "positionsVal"
      FROM "Positions"
      WHERE "userId" = :userId AND "Qty" > 0;
    `;

    const posResult = await sequelize.query(queryFallback, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
    });

    const positionsVal = posResult && posResult.length > 0 ? parseFloat(posResult[0].positionsVal) : 0;
    return parseFloat(user.Funds || 0) + positionsVal;
  }
}

/**
 * Saves or updates today's snapshot in TodaysAccountValue (UPSERT)
 * Only called on trade execution / transactions & scheduled daily close.
 */
async function saveTodaysAccountValue(userId) {
  const accountValue = await calculateUserAccountValue(userId);
  const user = await User.findByPk(userId);
  const cashBalance = user ? parseFloat(user.Funds) : 0;
  const today = new Date().toISOString().split("T")[0];

  const query = `
    INSERT INTO "TodaysAccountValues" ("id", "userId", "date", "totalValue", "cashBalance", "investedAmount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), :userId, :date, :totalValue, :cashBalance, :investedAmount, NOW(), NOW())
    ON CONFLICT ("userId", "date")
    DO UPDATE SET 
      "totalValue" = EXCLUDED."totalValue",
      "cashBalance" = EXCLUDED."cashBalance",
      "investedAmount" = EXCLUDED."investedAmount",
      "updatedAt" = NOW();
  `;

  await sequelize.query(query, {
    replacements: {
      userId,
      date: today,
      totalValue: accountValue,
      cashBalance,
      investedAmount: Math.max(0, accountValue - cashBalance),
    },
  });

  return accountValue;
}

/**
 * Get account value history filtered by date range
 */
async function getAccountValueHistory(userId, range = "1M") {
  let days = 30;
  if (range === "1D") days = 1;
  else if (range === "1W") days = 7;
  else if (range === "1M") days = 30;
  else if (range === "1Y") days = 365;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const history = await TodaysAccountValue.findAll({
    where: {
      userId,
      date: {
        [Op.gte]: startDate,
      },
    },
    order: [["date", "ASC"]],
  });

  if (!history || history.length === 0) {
    const currentVal = await calculateUserAccountValue(userId);
    return [
      {
        time: Math.floor(Date.now() / 1000),
        value: currentVal,
      },
    ];
  }

  return history.map((entry) => ({
    time: Math.floor(new Date(entry.date).getTime() / 1000),
    value: parseFloat(entry.totalValue),
  }));
}

module.exports = {
  calculateUserAccountValue,
  saveTodaysAccountValue,
  getAccountValueHistory,
};
