const Consumer = require('../models/Consumer');

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

module.exports = ConsumerController;
