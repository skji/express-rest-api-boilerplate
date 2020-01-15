const Quota = require('../models/Quota');
const Order = require('../models/Order');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const QuotaController = () => {
  const getAll = async (req, res) => {
    try {
      let quotas = await Quota.findAll();
      for(let i=0; i<quotas.length; i++) {
        const total1 = await Order.findOne({
          where: {
            quotaId: quotas[i].id,
            deadlineAt: {
              [Op.between]: ['2020-01-01','2020-04-01']
            }
          },
          attributes:[[Sequelize.fn('sum', Sequelize.col('amount')), 'total']],
          raw: true
        });
        const total2 = await Order.findOne({
          where: {
            quotaId: quotas[i].id,
            deadlineAt: {
              [Op.between]: ['2020-04-01','2020-07-01']
            }
          },
          attributes:[[Sequelize.fn('sum', Sequelize.col('amount')), 'total']],
          raw: true
        });
        const total3 = await Order.findOne({
          where: {
            quotaId: quotas[i].id,
            deadlineAt: {
              [Op.between]: ['2020-07-01','2020-10-01']
            }
          },
          attributes:[[Sequelize.fn('sum', Sequelize.col('amount')), 'total']],
          raw: true
        });
        const total4 = await Order.findOne({
          where: {
            quotaId: quotas[i].id,
            deadlineAt: {
              [Op.between]: ['2020-10-01','2021-01-01']
            }
          },
          attributes:[[Sequelize.fn('sum', Sequelize.col('amount')), 'total']],
          raw: true
        });

        quotas[i]['dataValues']['left'] = {
          '第一季度': quotas[i].amount/4 - total1.total,
          '第二季度': quotas[i].amount/4 - total2.total,
          '第三季度': quotas[i].amount/4 - total3.total,
          '第四季度': quotas[i].amount/4 - total4.total,
        };
      }

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
