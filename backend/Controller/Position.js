const { Position, User } = require("../models");

module.exports.newPosition = async (req, res) => {
  try {
    const { Instrument, Pro_Type = "CNC", Qty, LTP, Action = "BUY" } = req.body;
    const finalQty = Number(Qty);
    const finalPrice = Number(LTP);
    const totalCost = finalPrice * finalQty;

    const user = await User.findByPk(req.user);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (Action === "BUY" && user.Funds < totalCost) {
      return res.status(400).send("Insufficient Funds");
    }

    // Update funds
    if (Action === "BUY") {
      user.Funds -= totalCost;
    } else if (Action === "SELL") {
      user.Funds += totalCost;
    }
    await user.save();

    let position = await Position.findOne({ where: { userId: req.user, Instrument: Instrument } });

    if (position) {
      let newQty = Action === "BUY" ? position.Qty + finalQty : position.Qty - finalQty;
      if (newQty <= 0) {
        await position.destroy();
      } else {
        position.Qty = newQty;
        position.LTP = finalPrice;
        position.Curr_val = newQty * finalPrice;
        await position.save();
      }
    } else {
      await Position.create({
        Instrument: Instrument,
        Pro_Type: Pro_Type,
        Qty: finalQty,
        LTP: finalPrice,
        Curr_val: totalCost,
        PL: 0,
        Chg: 0,
        userId: req.user,
      });
    }

    res.send("position updated successfully!");
  } catch (err) {
    console.error("Error creating position:", err);
    res.status(500).send("error occurred");
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

module.exports.deletePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const position = await Position.findByPk(id);
    if (!position) {
      return res.status(404).send("Position not found");
    }
    await position.destroy();
    res.send("Position deleted successfully!");
  } catch (err) {
    console.error("Error deleting position:", err);
    res.status(500).send("error occurred");
  }
};
