const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const BorangSchema = new Schema({
	name: { type: String, required: true },
	cpmks: [{ type: String }],

	// * one subject only owned by one admin | one to one
	_student: { type: ObjectId, ref: 'student' },
});

const BorangModel = model('borang', BorangSchema);

const MhsSchema = new Schema(
	{
		nim: { type: String, required: true, unique: true },
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		programMBKM: { type: String, default: null },
		skAcc: { type: String, default: null },
		logsheet: [{ type: String, default: null }],

		_borang: [{ type: ObjectId, ref: 'borang' }],
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
const MhsModel = model('student', MhsSchema);

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

module.exports = MhsModel;
