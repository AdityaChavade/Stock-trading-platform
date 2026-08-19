const Holding = require("../model/HoldingModel");
module.exports.newHolding = (req, res) => {
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
};

module.exports.allHoldings = async (req, res) => {
  let allHoldings = await Holding.find({});
  res.json(allHoldings);
};

module.exports.deleteHoldings = async (req, res) => {
  await Holding.deleteMany({});
  res.send("All holdings deleted");
};