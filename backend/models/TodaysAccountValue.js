const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TodaysAccountValue = sequelize.define('TodaysAccountValue', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  totalValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cashBalance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  investedAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
});

module.exports = TodaysAccountValue;
