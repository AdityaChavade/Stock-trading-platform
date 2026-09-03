const router = require("express").Router();
const { newPosition,allPositions } = require("../Controller/Position");
router.post("/position", newPosition);
router.get("/allPosition",allPositions)
module.exports = router; 