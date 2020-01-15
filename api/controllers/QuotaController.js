const Quota = require('../models/Quota');
const Order = require('../models/Order');

const QuotaController = () => {
  const getAll = async (req, res) => {
    try {
      let quotas = await Quota.findAll();
      // for(let i=0; i<quotas.length; i++) {
      // }

      return res.status(200).json({ quotas });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const create = async (req, res) => {
    const { city, createdAt, amount, deadlineAt, documentId, documentHash, transaction} = req.body;

    const quota = await Quota.create({
      city: city,
      createdAt: createdAt,
      amount: amount,
      deadlineAt: deadlineAt,
      documentId: documentId,
      documentHash: documentHash,
      transaction: transaction,
    });

    return res.status(200).json({ quota });
  };

  return {
    getAll,
    create,
  };
};

module.exports = QuotaController;
