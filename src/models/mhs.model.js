const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MhsSchema = new mongoose.Schema(
	{
		nim: { type: String, required: true, unique: true },
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },

		// prodi mbkm
		programMBKM: { type: String, default: null },

		// upload sk diterima mbkm
		skMitra: { type: String, default: null },

		// upload borang mbkm
		borangMatkul: [{ type: String, default: null }],

		// upload logsheet
		logsheet: [{ type: String, default: null }],

		// temporary for reset password
		resetPasswordToken: { type: String, default: null },
		resetPasswordExpires: { type: Date, default: null },
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
		},
	}
);

MhsSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// will encrypt password everytime its saved
MhsSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const mhsModel = mongoose.model('student', MhsSchema);

module.exports = mhsModel;
