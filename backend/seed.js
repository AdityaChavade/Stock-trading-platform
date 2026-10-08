require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
const { sequelize, Stock, User, Watchlist } = require("./models");

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Connected to database and synced tables...");

    // 1. Create/Ensure 10 stocks exist in the database
    const dummyStocks = [
      { symbol: "RELIANCE", companyName: "Reliance Industries", price: 2950.0 },
      { symbol: "TCS", companyName: "Tata Consultancy Services", price: 3820.5 },
      { symbol: "HDFCBANK", companyName: "HDFC Bank", price: 1640.2 },
      { symbol: "INFY", companyName: "Infosys", price: 1510.8 },
      { symbol: "ICICIBANK", companyName: "ICICI Bank", price: 1040.6 },
      { symbol: "SBIN", companyName: "State Bank of India", price: 630.4 },
      { symbol: "BHARTIARTL", companyName: "Bharti Airtel", price: 1125.0 },
      { symbol: "ITC", companyName: "ITC Limited", price: 440.1 },
      { symbol: "L&T", companyName: "Larsen & Toubro", price: 3450.9 },
      { symbol: "TATAMOTORS", companyName: "Tata Motors", price: 890.3 },
    ];

    const createdStocks = [];
    for (const stockData of dummyStocks) {
      const [stock, created] = await Stock.findOrCreate({
        where: { symbol: stockData.symbol },
        defaults: {
          companyName: stockData.companyName,
          price: stockData.price,
        },
      });
      
      // Update price and companyName to make sure stock is up to date
      stock.companyName = stockData.companyName;
      stock.price = stockData.price;
      await stock.save();

      createdStocks.push(stock);
    }

    console.log(`Ensured ${createdStocks.length} stocks in database.`);

    // 2. Fetch all users from the database
    const users = await User.findAll();
    
    if (users.length === 0) {
      console.log("No users found in database.");
      process.exit(0);
    }

    console.log(`Found ${users.length} users. Populating watchlists, holdings, positions, and orders...`);

    const { Holding, Position, Order, TodaysAccountValue } = require("./models");

    for (const user of users) {
      // 3. Add watchlists
      for (const stock of createdStocks) {
        await Watchlist.findOrCreate({
          where: { userId: user.id, stockId: stock.id },
        });
      }

      // 4. Add sample Holdings
      await Holding.findOrCreate({
        where: { userId: user.id, name: "RELIANCE" },
        defaults: { qty: 10, avg: 2800.0, price: 2950.0, net: "+5.35%", day: "+1.20%" }
      });
      await Holding.findOrCreate({
        where: { userId: user.id, name: "TCS" },
        defaults: { qty: 5, avg: 3700.0, price: 3820.5, net: "+3.25%", day: "-0.40%" }
      });
      await Holding.findOrCreate({
        where: { userId: user.id, name: "INFY" },
        defaults: { qty: 15, avg: 1450.0, price: 1510.8, net: "+4.19%", day: "+0.85%" }
      });

      // 5. Add sample Positions
      await Position.findOrCreate({
        where: { userId: user.id, Instrument: "TATAMOTORS" },
        defaults: { Pro_Type: "CNC", Qty: 20, LTP: 890.3, Curr_val: 17806.0, PL: 350.0, Chg: 1.5 }
      });
      await Position.findOrCreate({
        where: { userId: user.id, Instrument: "HDFCBANK" },
        defaults: { Pro_Type: "CNC", Qty: 10, LTP: 1640.2, Curr_val: 16402.0, PL: -120.0, Chg: -0.7 }
      });

      // 6. Add sample Orders
      await Order.findOrCreate({
        where: { userId: user.id, Instrument: "ICICIBANK" },
        defaults: { Type: "CNC", Avg_Price: 1040.6, Qty: 10 }
      });
      await Order.findOrCreate({
        where: { userId: user.id, Instrument: "SBIN" },
        defaults: { Type: "CNC", Avg_Price: 630.4, Qty: 25 }
      });

      // 7. Add sample 7-day historical Account Values for smooth chart display
      const today = new Date();
      for (let i = 7; i >= 0; i--) {
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - i);
        const dateStr = pastDate.toISOString().split("T")[0];
        const randomVal = 1000000 + Math.floor(Math.sin(i) * 15000 + i * 2000);

        await TodaysAccountValue.findOrCreate({
          where: { userId: user.id, date: dateStr },
          defaults: { totalValue: randomVal, cashBalance: user.Funds, investedAmount: randomVal - user.Funds }
        });
      }

      console.log(`Assigned sample data for user ${user.email}`);
    }

    console.log("✅ Watchlist, Holdings, Positions, and History seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Operation failed:", err);
    process.exit(1);
  }
}

seedDatabase();
