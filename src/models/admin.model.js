const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

// const user = {
// 	id: 1,
// 	fullName: "Admin Gombeng",
// 	email: "admin@gombeng.com",
// 	password: "lkasdjfkj3pu34urwerir2jr42",
// 	subjects: [
// 		{
// 			id: 1,
// 			code: "1234",
// 			name: "Pemrograman Website",
// 			cpmk: [
// 				{
// 					id: 1,
// 					code: "1234",
// 					name: "Judul besar cpmk",
// 					desc: "Detail cpmk"
// 				},
// 				{
// 					id: 1,
// 					code: "1234",
// 					name: "Judul besar cpmk",
// 					desc: "Detail cpmk"
// 				},
// 			]
// 		},
// 	]
// }

const CpmkSchema = new Schema({
	code: { type: String, required: true },
	name: { type: String, required: true },
	// * one cpmk only owned by one subject | one to one
	_subject: { type: ObjectId, ref: 'subject' },
});

const CpmkModel = model('cpmk', CpmkSchema);

const SubjectSchema = new Schema({
	code: { type: String, required: true },
	name: { type: String, required: true },

	// * one subject only owned by one admin | one to one
	_admin: { type: ObjectId, ref: 'admin' },

	// * one subject can have multiple cpmk | one to many
	_cpmks: [{ type: ObjectId, ref: 'cpmk' }],
});

const SubjectModel = model('subject', SubjectSchema);

const AdminSchema = new Schema(
	{
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },

		// * one admin can have multiple subject | one to many
		_subjects: [{ type: ObjectId, ref: 'subject' }],
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
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

// AdminSchema.pre('remove', function (next) {
// 	// Remove all the assignment docs that reference the removed person.
// 	this.model('AdminModel').remove({ _subjects: this._id }, next);
// });

const AdminModel = model('admin', AdminSchema);

module.exports = { AdminModel, SubjectModel, CpmkModel };
