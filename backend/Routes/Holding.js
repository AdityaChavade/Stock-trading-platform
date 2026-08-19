
const router = require("express").Router();
const { newHolding, allHoldings, deleteHoldings } = require("../Controller/Holding");
router.post("/", newHolding);
router.get("/allHoldings", allHoldings);
router.delete("/deleteHoldings", deleteHoldings);

module.exports = router;