const Ticket = require('../models/Ticket');
const Consumer = require('../models/Consumer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const ConsumerController = () => {
  const getAll = async (req, res) => {
    try {
      const consumers = await Consumer.findAll();

      return res.status(200).json({ consumers });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const get = async (req, res) => {
    const { id } = req.query;
    const { consumerId } = req.params;
    try {
      const consumer = await Consumer.findByPk(consumerId);

      return res.status(200).json({ consumer });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getByTruckId = async (req, res) => {
    const { id } = req.query;
    const { truckId } = req.params;

    const today= new Date(new Date().setHours(0,0,0,0));
    const tomorrow= new Date(new Date().setHours(24,0,0,0));
    const consumers = await Consumer.findAll({
      where: {
        consumeAt: {
          [Op.between]: [today, tomorrow],
        },
        trucks: {
          [Op.contains]: [truckId],
        }
      },
    });
    return res.status(200).json({ consumers });
  };

  const create = async (req, res) => {
    const { id, amount, transaction, orderId } = req.body;

    // let tx = {};
    // tx['申请'] = transaction;
    const consumer = await Consumer.create({
      orderId: orderId,
      amount: amount,
      status: '申请',
      //transactions: tx,
    });

    return res.status(200).json({ consumer });
  };

  const update = async (req, res) => {
    const { consumerId } = req.params;
    let consumer = await Consumer.findByPk(consumerId);
    if(consumer && req.body.status==1) {
      consumer.status = '安排';
      consumer.location = req.body.location;
      consumer.consumeAt = req.body.consumeAt;
      //consumer.transactions['安排'] = req.body.transaction;
    } else if(consumer && req.body.status==2) {
      consumer.status = '确认';
      consumer.trucks  = req.body.trucks;
      //consumer.transactions['确认'] = req.body.transaction;
      for(let truck of consumer.trucks) {
        await Ticket.create({
          truckId: truck,
          createdAt: consumer.consumerAt,
          status: '待进场',
          userId: req.body.id,
          consumerId: consumerId,
          transaction: req.body.transaction,
        });
      }
    }
    await consumer.save();
    return res.status(200).json({ consumer });
  };

  return {
    getAll,
    get,
    create,
    update,
    getByTruckId,
  };
};

module.exports = ConsumerController;
