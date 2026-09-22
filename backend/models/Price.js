const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StockPriceHistory = sequelize.define(
  "StockPriceHistory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    stock: {
      type: DataTypes.STRING,
      allowNull: false,
      uppercase: true,
      trim: true,
    },

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ["stock", "timestamp"],
      },
    ],
  }
);

module.exports = StockPriceHistory;