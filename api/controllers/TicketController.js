const User   = require('../models/User');
const Ticket = require('../models/Ticket');
const Consumer = require('../models/Consumer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const TicketController = () => {
  const getAll = async (req, res) => {
    try {
      const tickets = await Ticket.findAll();

      return res.status(200).json({ tickets });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getTrucks = async (req, res) => {
    const { location } = req.params;
    const today= new Date(new Date().setHours(0,0,0,0));
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
      const tickets = await Ticket.findAll({
        where: {
          truckId: {
            [Op.in]: trucks,
          },
          status: {
            [Op.in]: ['进场', '过磅']
          }
        }
      });

      return res.status(200).json({ tickets });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getByTruckId = async (req, res) => {
    const { location } = req.params;
    const today= new Date(new Date().setHours(0,0,0,0));
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
      const tickets = await Ticket.findAll({
        where: {
          truckId: {
            [Op.in]: trucks,
          },
          status: {
            [Op.in]: ['进场', '过磅']
          }
        }
      });

      return res.status(200).json({ tickets });
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
      if(status==0 && user.identity=='公安人员') {
        ticket  = await Ticket.create({
          truckId: truckId,
          status: '进场',
          createdAt: Date.now(),
          note: '正常进场',
          userId: id,
          transaction: transaction,
          consumerId: consumerId,
        });
      } else if(status==1 && user.identity=='砂厂人员') {
        ticket  = await Ticket.create({
          truckId: truckId,
          status: '过磅',
          createdAt: Date.now(),
          note: `过磅${amount}吨`,
          userId: id,
          transaction: transaction,
          consumerId: consumerId,
        });
      } else if(status==2 && user.identity=='公安人员') {
         ticket  = await Ticket.create({
          truckId: truckId,
          status: '出场',
          createdAt: Date.now(),
          note: '正常出场',
          userId: id,
          transaction: transaction,
          consumerId: consumerId,
        });
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
