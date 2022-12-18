const { SuperAdminModel } = require('../models/superAdmin');
const controller = require('express')();
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const upload = require('../utils/multerSetup');
const mongoose = require('mongoose');

/*
 * endpoint untuk mendapatkan semua admin
 */
controller.get(
	'/',
	asyncHandler(async (req, res, next) => {
		const data = await SuperAdminModel.find();
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk login admin
 */
controller.post(
	'/login',
	asyncHandler(async (req, res, next) => {
		const { email, password } = req.body;
		const user = await SuperAdminModel.findOne({ email });
		if (!user) {
			res.status(404);
			throw new Error('Pengguna tidak ditemukan!');
		}
		if (user && (await user.matchPassword(password))) {
			res.status(200).json({
				data: user,
				token: generateToken(user._id),
			});
		} else {
			res.status(402);
			throw new Error('Email / password salah!');
		}
	})
);

/*
 * endpoint untuk register admin
 */
controller.post(
	'/register',
	asyncHandler(async (req, res, next) => {
		const { fullName, email, password } = req.body;
		const userEmail = await SuperAdminModel.findOne({ email });
		if (userEmail) {
			res.status(402);
			throw new Error('Email sudah digunakan!');
		}
		const user = new SuperAdminModel({ fullName, email, password });
		await user
			.save()
			.then((data) => {
				res.status(200).json({
					data,
					token: generateToken(data._id),
				});
			})
			.catch((error) => next(error));
	})
);

module.exports = controller;

