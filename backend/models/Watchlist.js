const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Watchlist = sequelize.define(
  "Watchlist",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },

    stockId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Stocks",
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "stockId"],
      },
    ],
  }
);

module.exports = Watchlist;