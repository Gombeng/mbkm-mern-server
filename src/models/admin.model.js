const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const CpmkSchema = new Schema({
	code: { type: String, required: true },
	name: { type: String, required: true },
	idSubject: { type: ObjectId, ref: 'subject' },
});

const CpmkModel = model('cpmk', CpmkSchema);

const SubjectSchema = new Schema({
	code: { type: String, required: true },
	name: { type: String, required: true },
	idAdmin: { type: ObjectId, ref: 'admin' },
	idCpmks: [{ type: ObjectId, ref: 'cpmk' }],
});

const SubjectModel = model('subject', SubjectSchema);

const AdminSchema = new Schema(
	{
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		idSubjects: [{ type: ObjectId, ref: 'subject' }],
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
	}
);

AdminSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

AdminSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const AdminModel = model('admin', AdminSchema);

module.exports = { AdminModel, SubjectModel, CpmkModel };
