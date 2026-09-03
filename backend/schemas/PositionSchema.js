const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PositionSchema = new Schema({
  Instrument: String,
  Pro_Type: String,
  Qty: Number,
  LTP: Number,
  Curr_val: Number,
  PL: Number,
  Chg: Number,
});

module.exports = PositionSchema;