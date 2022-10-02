const routes = require('express')();
const mhsController = require('../controllers/mhs.controller')
const imgController = require('../controllers/img.controller')

routes.use('/student', mhsController);
routes.use('/image', imgController);

module.exports = routes