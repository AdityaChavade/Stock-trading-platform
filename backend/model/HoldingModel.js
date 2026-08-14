const mongoose = require("mongoose");
const HoldingSchema = require("../schemas/holdingSchema");

const HoldingModel = mongoose.model("Holding", HoldingSchema);

module.exports = HoldingModel;