const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const hooks = {
};

const tableName = 'tickets';

const Ticket = sequelize.define('Ticket', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  trunkId: {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.DATE,
  },
  status: {
    type: Sequelize.ENUM('进场', '过磅', '出场'),
  },
  note: {
    type: Sequelize.STRING,
  },
  userId: {
    type: Sequelize.STRING,
  },
  consumerId: {
    type: Sequelize.INTEGER,
  },
  transaction: {
    type: Sequelize.STRING,
  },
}, { underscored:true, hooks, tableName });

module.exports = Ticket;
