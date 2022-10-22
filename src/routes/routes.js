const routes = require('express')();
const mhsController = require('../controllers/mhs.controller');
const adminController = require('../controllers/admin.controller');
const imgController = require('../controllers/img.controller');

routes.use('/admin', adminController);
routes.use('/student', mhsController);
routes.use('/image', imgController);

module.exports = routes;
