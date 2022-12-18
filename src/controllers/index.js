const mahasiswaController = require('./mahasiswa');
const adminController = require('./admin');
const superAdminController = require('./superAdmin');
const passResetController = require('./passwordReset');

module.exports = {
	mahasiswaController,
	adminController,
	superAdminController,
	passResetController,
};
