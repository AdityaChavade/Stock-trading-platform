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

io.on("connection", (socket) => {
  socket.on("joinUserRoom", (userId) => {
    socket.join(`user:${userId}`);
  });
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const { getAccountValueHistory, saveTodaysAccountValue } = require("./services/AccountValueService");
const { onStockPriceChange } = require("./services/AccountBroadcaster");

app.get("/api/accountvalue", userVerification, async (req, res) => {
  try {
    const range = req.query.range || "1M";
    const history = await getAccountValueHistory(req.user, range);
    res.json(history);
  } catch (error) {
    console.error("Error fetching account value history:", error);
    res.status(500).json({ error: "Failed to fetch account history" });
  }
});

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
    const { Instruments, Type = "CNC", Action = "BUY", OrderType = "MARKET", Avg_Price, Qty } = req.body;
    const user = await User.findByPk(req.user);
    const totalCost = Avg_Price * Qty;

    if (Action === "BUY" && totalCost > user.Funds) {
      return res.status(400).send("Insufficient Funds");
    }

    if (OrderType === "MARKET") {
      // 1. Deduct or credit funds
      if (Action === "BUY") {
        user.Funds -= totalCost;
      } else if (Action === "SELL") {
        user.Funds += totalCost;
      }
      await user.save();

      // 2. Direct conversion to Position
      let position = await Position.findOne({ where: { userId: req.user, Instrument: Instruments } });

      if (position) {
        let newQty = Action === "BUY" ? position.Qty + Qty : position.Qty - Qty;
        if (newQty <= 0) {
          await position.destroy();
        } else {
          position.Qty = newQty;
          position.LTP = Avg_Price;
          await position.save();
        }
      } else {
        await Position.create({
          Instrument: Instruments,
          Pro_Type: Type,
          Qty: Qty,
          LTP: Avg_Price,
          Curr_val: totalCost,
          PL: 0,
          Chg: 0,
          userId: req.user,
        });
      }

      console.log("Market Order executed & converted to Position!");
      return res.send("Position created successfully");
    } else {
      // Limit order - save to Orders table as PENDING
      const newOrder = await Order.create({
        Instrument: Instruments,
        Type: Type,
        Action: Action,
        Avg_Price: Avg_Price,
        Qty: Qty,
        userId: req.user,
      });
      console.log("Limit Order Submitted!");
      return res.send("Order saved");
    }
  } catch (error) {
    console.error("Order processing error:", error);
    res.status(500).send("Error processing order");
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


app.post("/cancelOrder/:id", userVerification, async (req, res) => {
  let order = await Order.findByPk(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  await order.destroy();
  res.json({ success: true });
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

async function matchPendingOrders(symbol, newPrice, io) {
  try {
    const pendingOrders = await Order.findAll({ where: { Instrument: symbol } });
    for (const order of pendingOrders) {
      const action = order.Action || "BUY";
      const isBuyMatch = action === "BUY" && newPrice <= order.Avg_Price;
      const isSellMatch = action === "SELL" && newPrice >= order.Avg_Price;

      if (isBuyMatch || isSellMatch) {
        const user = await User.findByPk(order.userId);
        if (!user) continue;

        const totalCost = order.Avg_Price * order.Qty;

        if (isBuyMatch) {
          if (user.Funds < totalCost) continue;
          user.Funds -= totalCost;
        } else {
          user.Funds += totalCost;
        }
        await user.save();

        let position = await Position.findOne({ where: { userId: order.userId, Instrument: order.Instrument } });
        if (position) {
          let newQty = isBuyMatch ? position.Qty + order.Qty : position.Qty - order.Qty;
          if (newQty <= 0) {
            await position.destroy();
          } else {
            position.Qty = newQty;
            position.LTP = newPrice;
            await position.save();
          }
        } else {
          if (isBuyMatch) {
            await Position.create({
              Instrument: order.Instrument,
              Pro_Type: order.Type || "CNC",
              Qty: order.Qty,
              LTP: newPrice,
              Curr_val: totalCost,
              PL: 0,
              Chg: 0,
              userId: order.userId,
            });
          }
        }

        await order.destroy();

        if (io) {
          io.emit("orderExecuted", {
            orderId: order.id,
            userId: order.userId,
            symbol: order.Instrument,
            executedPrice: newPrice,
            qty: order.Qty,
            action: action
          });
        }
      }
    }
  } catch (err) {
    console.error("Error matching pending orders:", err);
  }
}

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

    // Match pending limit orders against new price
    await matchPendingOrders(stock.symbol, stock.price, io);

    // Trigger event-driven live account value calculation for holding users
    await onStockPriceChange(stock.id, io);

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
