const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const hooks = {
};

const tableName = 'quotas';

const Quota = sequelize.define('Quota', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  city: {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.DATEONLY,
  },
  deadlineAt: {
    type: Sequelize.DATEONLY,
  },
  amount: {
    type: Sequelize.INTEGER,
  },
  documentId: {
    type: Sequelize.STRING,
  },
  documentHash: {
    type: Sequelize.STRING,
  },
  transaction: {
    type: Sequelize.STRING,
  },
}, { hooks, tableName });

module.exports = Quota;
