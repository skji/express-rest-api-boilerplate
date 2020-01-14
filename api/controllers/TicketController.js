const User   = require('../models/User');
const Ticket = require('../models/Ticket');

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

  const getByTruckId = async (req, res) => {
    const { truckId } = req.params;
    try {
      const tickets = await Ticket.findAll({
        where: {
          truckId: truckId,
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
      if(status==0 && user.identity==2) {
        ticket  = await Ticket.create({
          truckId: truckId,
          status: '进场',
          createdAt: Date.now(),
          note: '正常进场',
          userId: id,
          transaction: transaction,
          consumerId: consumerId,
        });
      } else if(status==1 && user.identity==1) {
        ticket  = await Ticket.create({
          truckId: truckId,
          status: '过磅',
          createdAt: Date.now(),
          note: `过磅${amount}吨`,
          userId: id,
          transaction: transaction,
          consumerId: consumerId,
        });
      } else if(status==2 && user.identity==2) {
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
    getByTruckId,
  };
};

module.exports = TicketController;
