const { Position } = require("../models");

module.exports.newPosition = async (req, res) => {
  try {
    const newPosition = await Position.create({
      Instrument: "BHARTIARTL",
      Pro_Type: "CNC",
      Qty: 2,
      LTP: 538.05,
      Curr_val: 541.15,
      PL: 0.58,
      Chg: 0.5,
      userId: req.user,
    });
    res.send("position !");
  } catch (err) {
    res.send("error occured ");
  }
};

module.exports.allPositions = async (req, res) => {
  try {
    let allPositions = await Position.findAll({ where: { userId: req.user } });
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "error occurred" });
  }
};
