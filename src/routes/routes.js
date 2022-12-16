const routes = require('express')();
const {
	mahasiswaController,
	adminController,
	passResetController,
} = require('../controllers');

routes.use('/students', mahasiswaController);
routes.use('/admins', adminController);
routes.use('/password-reset', passResetController);

module.exports = routes;
