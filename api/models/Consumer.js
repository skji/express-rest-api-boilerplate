const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const hooks = {
};

const tableName = 'consumers';

const Consumer = sequelize.define('Consumer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: Sequelize.INTEGER,
  },
  consumed: {
    type: Sequelize.FLOAT,
  },
  consumeAt: {
    type: Sequelize.DATEONLY,
  },
  amount: {
    type: Sequelize.INTEGER,
  },
  location: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.ENUM('申请', '安排', '确认', '进场', '兑现'),
  },
  trucks: {
    type: Sequelize.ARRAY(Sequelize.STRING),
  },
  transactions: {
    type: Sequelize.ARRAY(Sequelize.STRING),
  },
}, { underscored:true, hooks, tableName });

module.exports = Consumer;
