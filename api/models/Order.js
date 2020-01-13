const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const hooks = {
};

const tableName = 'orders';

const Order = sequelize.define('Order', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  city: {
    type: Sequelize.STRING,
  },
  quotaId: {
    type: Sequelize.INTEGER,
  },
  deadlineAt: {
    type: Sequelize.DATEONLY,
  },
  userId: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.ENUM('申请待审批', '审批待付款', '付款待确认', '确认'),
  },
  price: {
    type: Sequelize.FLOAT,
  },
  receiptHash: {
    type: Sequelize.STRING
  },
  amount: {
    type: Sequelize.INT
  },
  transactions: {
    type: Sequelize.ARRAY(Sequelize.STRING),
  },
}, { hooks, tableName });

module.exports = Order;
