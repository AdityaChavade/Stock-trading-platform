const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Holding = sequelize.define('Holding', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  qty: DataTypes.INTEGER,
  avg: DataTypes.FLOAT,
  price: DataTypes.FLOAT,
  net: DataTypes.STRING,
  day: DataTypes.STRING,
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
});

module.exports = Holding;
