const publicRoutes = {
  'GET /quotas': 'QuotaController.getAll',
  'POST /quota': 'QuotaController.create',
  'GET /orders': 'OrderController.getAll',
  'GET /order/:orderId': 'OrderController.get',
  'POST /order': 'OrderController.create',
  'PATCH /order': 'OrderController.update',
  'GET /consumers': 'ConsumerController.getAll',
  'GET /consumer/:consumerId': 'ConsumerController.get',
  'POST /consumer': 'ConsumerController.create',
  'PATCH /consumer/:consumerId': 'ConsumerController.update',
  'GET /tickets': 'TicketController.getAll',
  'POST /ticket': 'TicketController.create',
  'GET /user/:id': 'UserController.get',
};

module.exports = publicRoutes;
