const Quota = require('../models/Quota');

const QuotaController = () => {
  const getAll = async (req, res) => {
    try {
      const quotas = await Quota.findAll();

      return res.status(200).json({ quotas });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const create = async (req, res) => {

  };

  const getById = async (req,res) => {

  };

  return {
    getAll,
    create,
  };
};

module.exports = QuotaController;
