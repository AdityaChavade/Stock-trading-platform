const { sequelize, Stock, User, Watchlist } = require("./models");

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database for seeding...");

    // 1. Create/Ensure some dummy stocks exist
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
      const randomPrice = stockData.price + (Math.random() * 50 - 25);
      const [stock] = await Stock.findOrCreate({
        where: { symbol: stockData.symbol },
        defaults: {
          companyName: stockData.companyName,
          price: parseFloat(randomPrice.toFixed(2)),
        },
      });
      createdStocks.push(stock);
    }

    // 2. Fetch all users from the database
    const users = await User.findAll();
    
    if (users.length === 0) {
      console.log("No users found in the database. Create some users first!");
      process.exit(0);
    }

    console.log(`Found ${users.length} users. Assigning random watchlists...`);

    // 3. Loop through every user and give them a random number of stocks
    for (const user of users) {
      // Pick a random number of stocks between 2 and 7
      const numStocks = Math.floor(Math.random() * 6) + 2;
      
      // Shuffle the stocks array so they get a random selection
      const shuffledStocks = [...createdStocks].sort(() => 0.5 - Math.random());
      
      // Take the first 'numStocks' from the shuffled array
      const selectedStocks = shuffledStocks.slice(0, numStocks);

      for (const stock of selectedStocks) {
        await Watchlist.findOrCreate({
          where: { userId: user.id, stockId: stock.id },
        });
      }
      
      console.log(`Assigned ${numStocks} random stocks to user ${user.email}`);
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();
