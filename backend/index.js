require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Holding = require("./model/HoldingModel");
const Position = require("./model/PositionModel");
const OrderModel = require("./model/OrderModel");
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;
const cors = require("cors");
const PositionRoute = require("./Routes/Position");
const AuthRoute = require("./Routes/AuthRoute");
const OrderRoute = require("./Routes/Orders");
const HoldingRoute = require("./Routes/Holding");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
})); // IMPORTANT for React
app.use(express.json());

app.use("/position",PositionRoute);
app.use("/",AuthRoute);

app.use("/holding",HoldingRoute);

app.use("/order",OrderRoute);

app.listen(3000, () => {
  console.log("running website !");
  mongoose.connect(uri);
  console.log("datbase conneted !");
});
