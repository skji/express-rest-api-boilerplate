const User = require('../models/User');
const Order = require('../models/Order');
const Quota = require('../models/Quota');
const Consumer = require('../models/Consumer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const OrderController = () => {
  const getAll = async (req, res) => {
    try {
      const orders = await Order.findAll();
      for(let i=0; i<orders.length; i++) {
        const total = await Consumer.findOne({
          where: {
            orderId: orders[i].id,
          },
          attributes:[[Sequelize.fn('sum', Sequelize.col('amount')), 'total']],
          raw: true
        });
        orders[i]['dataValues']['left'] = orders[i].amount - total.total;
      }

      return res.status(200).json({ orders });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const get = async (req, res) => {
    const { id } = req.query;
    const { orderId } = req.params;
    try {
      const order = await Order.findByPk(orderId);
      const total = await Consumer.findOne({
        where: {
          orderId: orderId,
        },
        attributes:[[Sequelize.fn('sum', Sequelize.col('amount')), 'total']],
        raw: true
      });
      order['dataValues']['left'] = order.amount - total.total;

      return res.status(200).json({ order });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const create = async (req, res) => {
    let { id, city, deadlineAt, price, amount, transaction } = req.body;
    const quotas = await Quota.findAll({
      where: {
        city: city,
        createdAt: {
          [Op.lte]: deadlineAt
        },
        deadlineAt: {
          [Op.gte]: deadlineAt
        }
      },
      order: [['amount', 'ASC']],
    });

    let orders = [];
    for(let quota of quotas) {
      let order;
      if(quota.amount >= amount) {
        order = await Order.create({
          city: city,
          deadlineAt: deadlineAt,
          price: price,
          amount: amount,
          userId: id,
          status: '申请',
          quotaId: quota.id,
          transactions: {申请:transaction}
        });
        break;
      } else {
        order = await Order.create({
          city: city,
          deadlineAt: deadlineAt,
          price: price,
          amount: quota.amount,
          userId: id,
          status: '申请',
          quotaId: quota.id,
          transactions: {申请:transaction}
        });
        amount -= quota.amount;
      }
      orders.push(order);
    }

    return res.status(200).json({ orders });
  };

  const update = async (req, res) => {
    const { orderId } = req.body;
    let order = await Order.findByPk(orderId);
    if(order && req.body.status==1) {
      order.status = '审批';
      order.note = req.body.note;
      order.transactions.审批 = req.body.transaction;
    } else if(order && req.body.status==2) {
      order.status = '付款';
      order.receiptHash = req.body.receiptHash;
      order.receiptUrl = req.body.receiptUrl;
      order.transactions.付款 = req.body.transaction;
    } else if(order && req.body.status==3) {
      order.status = '确认';
      order.transactions.确认 = req.body.transaction;
    }
    order.set('transactions', order.transactions);
    await order.save();
    return res.status(200).json({ order });
  };

  return {
    getAll,
    create,
    update,
    get,
  };
};

module.exports = OrderController;
