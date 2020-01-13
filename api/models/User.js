const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const hooks = {
};

const tableName = 'users';

const User = sequelize.define('User', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  identity: {
    type: Sequelize.ENUM('管理员', '砂厂人员', '公安人员', '购砂企业', '运砂车辆', '司机'),
  },
  telephone: {
    type: Sequelize.STRING,
  },
  info: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
  },
  title: {
    type: Sequelize.STRING,
  },
  serial: {
    type: Sequelize.STRING,
  },
}, { underscored:true, hooks, tableName });

module.exports = User;
