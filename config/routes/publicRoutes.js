const publicRoutes = {
  'GET /tickets': 'TicketController.getAll',
  'POST /ticket': 'TicketController.create',
  'GET /user/:id': 'UserController.get',
};

module.exports = publicRoutes;
