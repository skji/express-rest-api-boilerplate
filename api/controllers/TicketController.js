const User   = require('../models/User');
const Ticket = require('../models/Ticket');
const Consumer = require('../models/Consumer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const TicketController = () => {
  const getAll = async (req, res) => {
    const { consumerId } = req.params;
    try {
      const tickets = await Ticket.findAll({
        where: {
          consumerId: consumerId
        },
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({ tickets });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getTrucks = async (req, res) => {
    const { id } = req.query;
    const user = await User.findByPk(id);
    const location = user.location;
    const today = new Date(new Date().setHours(0,0,0,0));
    const tomorrow= new Date(new Date().setHours(24,0,0,0));
    const consumers = await Consumer.findAll({
      where: {
        location: location,
        consumeAt: {
          [Op.between]: [today, tomorrow],
        },
      },
      attributes: ['trucks'],
    });
    let trucks = [];
    for(let consumer of consumers) {
      trucks.push.apply(trucks, consumer.trucks);
    }
    try {
      const ts = await Ticket.findAll({
        group: ['truckId'],
        attributes: ['truckId', [Sequelize.fn('max', Sequelize.col('createdAt')), 'created']],
        where: {
          truckId: {
            [Op.in]: trucks,
          },
          status: {
            [Op.in]: ['进场', '过磅', '出场']
          },
          createdAt: {
            [Op.between]: [today, tomorrow],
          },
        },
        order: [[Sequelize.literal('created'), 'DESC']],
        raw: true
      });
      let tickets = [];
      for(let t of ts) {
        let ticket = await Ticket.findOne({
          where: {
            truckId: t.truckId,
            createdAt: t.created,
          }
        });
        let name = await User.findByPk(t.truckId, {attributes:['name']});
        ticket['dataValues']['name'] = name.name;
        tickets.push(ticket);
      }

      return res.status(200).json({ tickets });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getByTruckId = async (req, res) => {
    const { truckId } = req.params;
    const { id } = req.query;
    const today = new Date(new Date().setHours(0,0,0,0));
    const tomorrow= new Date(new Date().setHours(24,0,0,0));
    try {
      const ticket = await Ticket.findOne({
        where: {
          truckId: truckId,
          status: {
            [Op.in]: ['待进场', '进场', '过磅', '出场']
          },
          createdAt: {
            [Op.between]: [today, tomorrow],
          },
        },
        order: [['createdAt', 'DESC'], ['id', 'DESC']]
      });
      const truck = await User.findByPk(truckId);
      if(ticket) {
        const consumer = await Consumer.findByPk(ticket.consumerId);
        return res.status(200).json({
          name: truck.name,
          info: truck.info,
          consumeAt: consumer.consumeAt,
          location: consumer.location,
          amount: consumer.amount,
          consumerId: consumer.id,
          consumed: consumer.consumed,
          status: ticket.status,
          note: ticket.note,
        });
      } else {
        return res.status(404).send('Not Found');
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const create = async (req, res) => {
    try {
      const { id, status, amount, consumerId, truckId, transaction} = req.body;

      const user = await User.findByPk(id);

      let ticket;
      if(status==1 && user.identity=='公安人员') {
        ticket  = await Ticket.create({
          truckId: truckId,
          status: '进场',
          createdAt: Date.now(),
          note: '正常进场',
          userId: id,
          transaction: transaction,
          consumerId: consumerId,
        });
        let consumer = await Consumer.findByPk(consumerId);
        consumer.status = '进场';
        consumer.transactions.进场 = transaction;
        consumer.set('transactions', consumer.transactions);
        await consumer.save();
      } else if(status==2 && user.identity=='砂厂人员') {
        ticket  = await Ticket.create({
          truckId: truckId,
          status: '过磅',
          createdAt: Date.now(),
          note: `过磅${amount}吨`,
          userId: id,
          transaction: transaction,
          consumerId: consumerId,
        });
        let consumer = await Consumer.findByPk(consumerId);
        consumer.consumed = Number(consumer.consumed) + Number(amount);
        await consumer.save();
      } else if(status==3 && user.identity=='公安人员') {
         ticket  = await Ticket.create({
          truckId: truckId,
          status: '出场',
          createdAt: Date.now(),
          note: '正常出场',
          userId: id,
          transaction: transaction,
          consumerId: consumerId,
        });
        let consumer = await Consumer.findByPk(consumerId);
        if(consumer.consumed>=consumer.amount) {
          consumer.status = '兑现';
          consumer.transactions.兑现 = transaction;
          await Ticket.destroy({
            where: {
              consumerId: consumerId,
              status: '待进场',
            }
          });
          consumer.set('transactions', consumer.transactions);
          await consumer.save();
        } else {
           await Ticket.create({
            truckId: truckId,
            createdAt: Date.now(),
            status: '待进场',
            userId: id,
            consumerId: consumerId,
            transaction: transaction,
          });
        }
      };

      return res.status(200).json({ ticket });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    getAll,
    create,
    getTrucks,
    getByTruckId,
  };
};

module.exports = TicketController;
