const router = require("express").Router();
const { newPosition, allPositions, deletePosition } = require("../Controller/Position");
router.post("/position", newPosition);
router.get("/allPosition", allPositions);
router.get("/allPositions", allPositions);
router.delete("/position/:id", deletePosition);
module.exports = router;