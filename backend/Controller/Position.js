const { Position, User,Stock } = require("../models");

module.exports.newPosition = async (req, res) => {
  try {
    const { Instrument, Pro_Type = "CNC", Qty, LTP, Action = "BUY" } = req.body;
    const qty = Number(Qty);
    const price = Number(LTP);
    const cost = qty * price;
    const normalizedAction = (Action || "BUY").toUpperCase();

    if (!(qty > 0) || !(price > 0) || !["BUY", "SELL"].includes(normalizedAction)) {
      return res.status(400).send("Invalid input");
    }

    const user = await User.findByPk(req.user);
    if (!user) return res.status(404).send("User not found");

    const position = await Position.findOne({
      where: { userId: req.user, Instrument, Pro_Type },
    });

    // Validate first, change nothing until everything passes
    if (normalizedAction === "BUY" && user.Funds < cost) {
      return res.status(400).send("Insufficient Funds");
    }
    if (normalizedAction === "SELL" && (!position || position.Qty < qty)) {
      return res.status(400).send("Cannot sell more than held in position");
    }

    if (normalizedAction === "BUY") {
      if (position) {
        const newQty = position.Qty + qty;
        // Weighted average price
        position.Avg_Price = (position.Qty * position.Avg_Price + cost) / newQty;
        position.Qty = newQty;
        await position.save();
      } else {
        await Position.create({
          Instrument,
          Pro_Type,
          Qty: qty,
          Avg_Price: price,
          userId: req.user,
        });
      }
      user.Funds -= cost;
    } else {
      const newQty = position.Qty - qty;
      if (newQty === 0) {
        await position.destroy();
      } else {
        position.Qty = newQty;
        await position.save();
      }
      user.Funds += cost;
    }

    await user.save();
    res.send("position updated successfully!");
  } catch (err) {
    console.error("Error creating position:", err);
    res.status(500).send("error occurred");
  }
};
module.exports.allPositions = async (req, res) => {
  try {
    const positions = await Position.findAll({
      where: { userId: req.user },
      include: Stock,
    });
 
    // Fetch all stocks once to support both symbol and companyName matching
    const allStocks = await Stock.findAll();
    const stockBySymbol = new Map();
    const stockByName = new Map();
    for (const s of allStocks) {
      if (s.symbol) stockBySymbol.set(s.symbol.toUpperCase(), s);
      if (s.companyName) stockByName.set(s.companyName.toUpperCase(), s);
    }

    const result = positions.map((p) => {
      const avg = Number(p.Avg_Price);
      const stockMatch =
        p.Stock ||
        stockBySymbol.get((p.Instrument || "").toUpperCase()) ||
        stockByName.get((p.Instrument || "").toUpperCase());

      const ltp = stockMatch ? Number(stockMatch.price) : avg; // fallback if no price row
      const invested = p.Qty * avg;
      const currVal = p.Qty * ltp;
      const pl = currVal - invested;
 
      return {
        id: p.id,
        Instrument: p.Instrument,
        Pro_Type: p.Pro_Type,
        Qty: p.Qty,
        Avg_Price: Number(avg.toFixed(2)),
        LTP: Number(ltp.toFixed(2)),
        Curr_val: Number(currVal.toFixed(2)),
        PL: Number(pl.toFixed(2)),
        Chg: Number((invested ? (pl / invested) * 100 : 0).toFixed(2)), // % change vs avg price
      };
    });
 
    res.json(result);
  } catch (err) {
    console.error("Error fetching positions:", err);
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
