const routes = require('express')();
const {
	mahasiswaController,
	adminController,
	passResetController,
} = require('../controllers');

routes.use('/student', mahasiswaController);
routes.use('/admin', adminController);
routes.use('/password-reset', passResetController);

module.exports = routes;
