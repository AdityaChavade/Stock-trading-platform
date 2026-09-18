const router = require("express").Router();
const {newOrder,allOrders} = require("../Controller/Orders");

router.post("/",newOrder);
router.get("/allOrders",allOrders);
module.exports = router;