const mongoose=require("mongoose");
const OrderSchema = require("../schemas/OrderSchema.js");

const OrderModel= mongoose.model("Order",OrderSchema)

module.exports=OrderModel;


