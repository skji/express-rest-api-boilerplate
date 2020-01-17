const publicRoutes = {
  'GET /quotas': 'QuotaController.getAll',
  'POST /quota': 'QuotaController.create',
  'GET /orders': 'OrderController.getAll',
  'GET /order/:orderId': 'OrderController.get',
  'POST /order': 'OrderController.create',
  'PATCH /order': 'OrderController.update',
  'GET /consumers': 'ConsumerController.getAll',
  'GET /consumer/:consumerId': 'ConsumerController.get',
  'GET /consumers/:truckId': 'ConsumerController.getByTruckId',
  'POST /consumer': 'ConsumerController.create',
  'PATCH /consumer/:consumerId': 'ConsumerController.update',
  'GET /tickets': 'TicketController.getTrucks',
  'GET /tickets/:consumerId': 'TicketController.getAll',
  'GET /ticket/:truckId': 'TicketController.getByTruckId',
  'POST /ticket': 'TicketController.create',
  'GET /users': 'UserController.getAll',
  'GET /user/:id': 'UserController.get',
};

module.exports = publicRoutes;
