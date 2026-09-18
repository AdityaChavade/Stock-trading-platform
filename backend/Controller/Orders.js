const OrderModel = require("../model/OrderModel");
module.exports.newOrder = (req, res) => {
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
};

module.exports.allOrders = async (req, res) => {
  let allOrders = await OrderModel.find({});
  res.json(allOrders);
};
