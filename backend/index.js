require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
const express = require("express");
const { sequelize, Holding, Order, Position, Watchlist, Stock,User } = require("./models");
const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;
const cors = require("cors");
const PositionRoute = require("./Routes/Position");
const AuthRoute = require("./Routes/AuthRoute");
const { userVerification } = require("./Middlewares/AuthMiddleware");
const cookieParser = require("cookie-parser");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
app.set("io", io);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/holdings", userVerification, async (req, res) => {
  try {
    const newholding = await Holding.create({
      name: "BHARTIARTL",
      qty: 2,
      avg: 538.05,
      price: 541.15,
      net: "+0.58%",
      day: "+2.99%",
      userId: req.user,
    });
    res.send("holding saved ");
  } catch (err) {
    console.log("error occured", err);
    res.send("error occured ");
  }
});



app.post("/order", userVerification, async (req, res) => {
  try {
    const { Instruments, Type, Avg_Price, Qty } = req.body;
    const newOrder = await Order.create({
      Instrument: Instruments,
      Type: Type,
      Avg_Price: Avg_Price,
      Qty: Qty,
      userId: req.user,
    });
    console.log("Ordered Submitted !");
    res.send("ORder saved");
  } catch (error) {
    res.send("error");
  }
});

app.get("/allHoldings", userVerification, async (req, res) => {
  let allHoldings = await Holding.findAll({ where: { userId: req.user } });
  res.json(allHoldings);
});

app.get("/allOrders", userVerification, async (req, res) => {
  let allOrders = await Order.findAll({ where: { userId: req.user } });
  res.json(allOrders);
});

app.get("/getFunds", userVerification, async (req, res) => {
  try {
    const fun = await User.findByPk(req.user);
    if (!fun) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ funds: fun.Funds });
  } catch (error) {
    console.error("Error fetching funds:", error);
    res.status(500).json({ error: "Failed to fetch funds" });
  }
});


app.get("/deletePositions", userVerification, async (req, res) => {
  await Position.destroy({ where: { userId: req.user } });
  res.send("All positions deleted");
});

app.use("/position", userVerification, PositionRoute);
app.use("/",AuthRoute);

app.get("/api/watchlist", userVerification, async (req, res) => {
  try {
    const watchlist = await Watchlist.findAll({
      where: {
        userId: req.user,
      },
      include: [
        {
          model: Stock,
        },
      ],
    });
    res.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

app.post("/api/update-price", async (req, res) => {
  try {
    const { stockId, newPrice } = req.body;
    
    // Update price in DB
    const stock = await Stock.findByPk(stockId);
    if (!stock) return res.status(404).json({ error: "Stock not found" });
    
    stock.price = newPrice;
    await stock.save();

    // Emit the update event to all connected clients
    const io = req.app.get("io");
    io.emit("stockPriceUpdate", {
      stockId: stock.id,
      symbol: stock.symbol,
      price: stock.price
    });

    res.json({ success: true, stock });
  } catch (error) {
    console.error("Error updating price:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const serverInstance = httpServer.listen(PORT, () => {
  console.log(`running website on port ${PORT}!`);
  sequelize.sync().then(() => {
    console.log("database connected and models synced!");
  }).catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
});

serverInstance.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Address in use, retrying...');
  } else {
    console.error(e);
  }
});
