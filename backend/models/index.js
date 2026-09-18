const sequelize = require('../config/database');
const User = require('./User');
const Order = require('./Order');
const Position = require('./Position');
const Holding = require('./Holding');
const TodaysAccountValue = require('./TodaysAccountValue');

// Define Relationships
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Position, { foreignKey: 'userId' });
Position.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Holding, { foreignKey: 'userId' });
Holding.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(TodaysAccountValue, { foreignKey: 'userId' });
TodaysAccountValue.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Order,
  Position,
  Holding,
  TodaysAccountValue,
};
