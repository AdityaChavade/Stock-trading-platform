const mongoose=require("mongoose");
const OrderSchema=new mongoose.Schema({
    Instrument:String,
    Type:String,
    Avg_Price:Number,
    Qty:Number
})
module.exports=OrderSchema;
