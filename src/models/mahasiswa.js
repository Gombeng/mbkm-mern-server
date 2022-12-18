const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const accEnum = Object.freeze({
	acc: 'Diterima',
	pending: 'Ditinjau',
	decline: 'Ditolak',
});

const AnswerSchema = new Schema({
	name: { type: String, default: null },
	answer: { type: String, default: null },
});

const AnswerModel = model('answer', AnswerSchema);

const BorangSchema = new Schema({
	subject: { type: String, default: null },
	idStudent: { type: ObjectId, ref: 'student' },
	idAnswers: [{ type: ObjectId, ref: 'answer' }],
	statusDosen: { type: String, enum: accEnum, default: accEnum.pending },
	statusKajur: { type: String, enum: accEnum, default: accEnum.pending },
});

const BorangModel = model('borang', BorangSchema);

const MhsSchema = new Schema(
	{
		nim: { type: String, required: true, unique: true },
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		programMbkm: { type: String, default: null },
		skAcc: { type: String, default: null },
		logsheet: [{ type: String, default: null }],
		idBorangs: [{ type: ObjectId, ref: 'borang' }],
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

const MhsModel = model('student', MhsSchema);

module.exports = { MhsModel, BorangModel, AnswerModel, accEnum };
