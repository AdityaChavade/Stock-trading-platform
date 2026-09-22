const sequelize = require('../config/database');
const User = require('./User');
const Stock = require('./Stock');
const Price = require('./Price');
const Order = require('./Order');
const Position = require('./Position');
const Holding = require('./Holding');
const TodaysAccountValue = require('./TodaysAccountValue');
const Watchlist = require('./Watchlist');

// Define Relationships
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Position, { foreignKey: 'userId' });
Position.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Holding, { foreignKey: 'userId' });
Holding.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(TodaysAccountValue, { foreignKey: 'userId' });
TodaysAccountValue.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Watchlist, { foreignKey: 'userId' });
Watchlist.belongsTo(User, { foreignKey: 'userId' });

Stock.hasMany(Watchlist, {
  foreignKey: "stockId",
});

Watchlist.belongsTo(Stock, {
  foreignKey: "stockId",
});

module.exports = {
  sequelize,
  User,
  Order,
  Position,
  Holding,
  TodaysAccountValue,
  Watchlist,
  Price,
  Stock,
};
