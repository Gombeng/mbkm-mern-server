const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const tokenSchema = new Schema({
	userId: {
		type: ObjectId,
		required: true,
		ref: 'student',
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 3600,
	},
});

module.exports = model('token', tokenSchema);
