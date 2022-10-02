const mongoose = require('mongoose');

const ImgSchema = new mongoose.Schema(
	{
		image: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const ImgModel = mongoose.model('image', ImgSchema);

module.exports = ImgModel;
