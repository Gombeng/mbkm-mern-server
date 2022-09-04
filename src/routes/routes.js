const routes = require('express')();
const mhsController = require('../controllers/mhs.controller')

routes.use('/api/student', mhsController);

module.exports = routes