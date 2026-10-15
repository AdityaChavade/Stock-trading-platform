const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Position = sequelize.define(
  "Position",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    Instrument: { type: DataTypes.STRING, allowNull: false },
    Pro_Type: { type: DataTypes.STRING, allowNull: false, defaultValue: "CNC" },
    Qty: { type: DataTypes.INTEGER, allowNull: false },
    Avg_Price: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    userId: { type: DataTypes.UUID, allowNull: false },
  },
  {
    indexes: [
      // one position per user + instrument + product type
      { unique: true, fields: ["userId", "Instrument", "Pro_Type"] },
    ],
  }
);

module.exports = Position;