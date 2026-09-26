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

    console.log(`Found ${users.length} users. Adding 10 stocks to each user's watchlist...`);

    // 3. Add all 10 stocks to every user's watchlist
    for (const user of users) {
      for (const stock of createdStocks) {
        await Watchlist.findOrCreate({
          where: { userId: user.id, stockId: stock.id },
        });
      }
      console.log(`Assigned all 10 stocks to user ${user.email}`);
    }

    console.log("✅ Watchlist and Stock database updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Operation failed:", err);
    process.exit(1);
  }
}

seedDatabase();
