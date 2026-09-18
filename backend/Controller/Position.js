const Position = require("../model/PositionModel");

module.exports.newPosition = async (req, res) => {
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
};

module.exports.allPositions = async (req, res) => {
  try {
    let allPositions = await Position.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "error occurred" });
  }
};
