const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose;

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
	desc: { type: String, required: true },
});

const SubjectSchema = new Schema({
	code: { type: String, required: true },
	name: { type: String, required: true },
	cpmk: [{ CpmkSchema }],
});

const AdminSchema = new Schema(
	{
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		subjects: [{ SubjectSchema }],
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

const AdminModel = model('admin', AdminSchema);

module.exports = AdminModel;
