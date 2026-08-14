require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Holding = require("./model/HoldingModel");
const Position = require("./model/PositionModel");
const OrderModel = require("./model/OrderModel");
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;
const cors = require("cors");

const app = express();
app.use(cors()); // IMPORTANT for React
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/holdings", (req, res) => {
  const newholding = new Holding({
    name: "BHARTIARTL",
    qty: 2,
    avg: 538.05,
    price: 541.15,
    net: "+0.58%",
    day: "+2.99%",
  });
  newholding
    .save()
    .then((result) => {
      res.send("holding saved ");
    })
    .catch((err) => {
      console.log("error occured");
      res.send("error occured ");
    });
});

app.get("/position", (req, res) => {
  const newPosition = new Position({
    Instrument: "BHARTIARTL",
    Pro_Type: "CNC",
    Qty: 2,
    LTP: 538.05,
    Curr_val: 541.15,
    PL: 0.58,
    Chg: 0.5,
  });
  newPosition
    .save()
    .then((result) => {
      res.send("position !");
    })
    .catch((err) => {
      res.send("error occured ");
    });
});

app.post("/order", (req, res) => {
  const { Instruments, Type, Avg_Price, Qty } = req.body;
  const newOrder = new OrderModel({
    Instrument: Instruments,
    Type: Type,
    Avg_Price: Avg_Price,
    Qty: Qty,
  });
  newOrder
    .save()
    .then((result) => {
      console.log("Ordered Submitted !");
      res.send("ORder saved");
    })
    .catch((error) => {
      res.send("error");
    });
});

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await Holding.find({});
  res.json(allHoldings);
});

app.get("/allOrders", async (req, res) => {
  let allOrders = await OrderModel.find({});
  res.json(allOrders);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await Position.find({});
  res.json(allPositions);
});
app.get("/deletePositions", async (req, res) => {
  await Position.deleteMany({});
  res.send("All positions deleted");
});

app.listen(3000, () => {
  console.log("running website !");
  mongoose.connect(uri);
  console.log("datbase conneted !");
});
