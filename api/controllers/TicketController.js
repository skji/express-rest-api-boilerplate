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

  const create = async (req, res) => {
    try {
      const { id, ticketId, status, amount, consumerId, trunkId, transaction} = req.body;

      const user = await User.findByPk(id);

      let ticket;
      if(status==0 && user.identity==2) {
        ticket  = await Ticket.create({
          trunkId: trunkId,
          status: status,
          createdAt: Date.now(),
          note: '正常进场',
          userId: id,
          transaction: transaction,
          consumerId: consumerId,
        });
      } else if(status==1 && user.identity==1) {
        ticket  = await Ticket.create({
          trunkId: trunkId,
          status: status,
          createdAt: Date.now(),
          note: `过磅${amount}吨`,
          userId: id,
          transaction: transaction,
          consumerId: consumerId,
        });
      } else if(status==2 && user.identity==2) {
         ticket  = await Ticket.create({
          trunkId: trunkId,
          status: status,
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
  };
};

module.exports = TicketController;
