require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
const express = require("express");
const { sequelize, Holding, Order, Position } = require("./models");
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;
const cors = require("cors");
const PositionRoute = require("./Routes/Position");
const AuthRoute = require("./Routes/AuthRoute");
const { userVerification } = require("./Middlewares/AuthMiddleware");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
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


app.get("/deletePositions", userVerification, async (req, res) => {
  await Position.destroy({ where: { userId: req.user } });
  res.send("All positions deleted");
});

app.use("/position", userVerification, PositionRoute);
app.use("/",AuthRoute);

const server = app.listen(PORT, () => {
  console.log(`running website on port ${PORT}!`);
  sequelize.sync().then(() => {
    console.log("database connected and models synced!");
  }).catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Address in use, retrying...');
  } else {
    console.error(e);
  }
});
