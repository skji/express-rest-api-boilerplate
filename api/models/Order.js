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
    type: Sequelize.ENUM('申请', '审批', '付款', '确认'),
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
}, { underscored:true, hooks, tableName });

module.exports = Order;
