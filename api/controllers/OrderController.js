const Order = require('../models/Order');

const OrderController = () => {
  const getAll = async (req, res) => {
    try {
      const orders = await Order.findAll();

      return res.status(200).json({ orders });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const create = async (req, res) => {

  };

  const update = async (req, res) => {

  };

  const getById = async (req,res) => {

  };

  return {
    getAll,
    create,
    update,
  };
};

module.exports = OrderController;
