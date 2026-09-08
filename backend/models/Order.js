const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  Instrument: DataTypes.STRING,
  Type: DataTypes.STRING,
  Avg_Price: DataTypes.FLOAT,
  Qty: DataTypes.INTEGER,
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
});

module.exports = Order;
