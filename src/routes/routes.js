const routes = require('express')();
const {
	mahasiswaController,
	adminController,
	superAdminController,
	passResetController,
} = require('../controllers');

routes.use('/students', mahasiswaController);
routes.use('/admins', adminController);
routes.use('/super-admin', superAdminController);
routes.use('/password-reset', passResetController);

module.exports = routes;
