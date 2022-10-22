const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema(
	{
		nim: { type: String, required: true, unique: true },
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		programMBKM: { type: String, default: null },
		skAcc: { type: String, default: null },
		logsheet: [{ type: String, default: null }],
		// borangKonversi: [
		// 	{
		// 		name: { type: String, default: null },
		// 		borang: { type: String, default: null },
		// 	},
		// ],
		// resetPasswordToken: { type: String, default: null },
		// resetPasswordExpires: { type: Date, default: null },
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
		},
	}
);

AdminSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// will encrypt password everytime its saved
AdminSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const AdminModel = mongoose.model('student', AdminSchema);

module.exports = AdminModel;
