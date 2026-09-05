const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Position = sequelize.define('Position', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  Instrument: DataTypes.STRING,
  Pro_Type: DataTypes.STRING,
  Qty: DataTypes.INTEGER,
  LTP: DataTypes.FLOAT,
  Curr_val: DataTypes.FLOAT,
  PL: DataTypes.FLOAT,
  Chg: DataTypes.FLOAT,
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
});

module.exports = Position;
