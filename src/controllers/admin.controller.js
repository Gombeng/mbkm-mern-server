const {
	AdminModel,
	SubjectModel,
	CpmkModel,
} = require('../models/admin.model');
const controller = require('express')();
// gunakan modul ini supaya tidak perlu ribet return error
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const upload = require('../utils/multerSetup');
const mongoose = require('mongoose');

// GET ALL ADMIN
controller.get(
	'/getAll',
	asyncHandler(async (req, res, next) => {
		const data = await AdminModel.find();

		if (!data) {
			throw new Error('Gagal memuat data!');
		}

		res.status(200).json({ data: data });
	})
);

// GET ALL SUBJECTS
controller.get(
	'/getAll/subjects',
	asyncHandler(async (req, res, next) => {
		const data = await AdminModel.find().populate('_subjects');

		if (!data) {
			throw new Error('Gagal memuat data!');
		}

		res.status(200).json({ data: data });
	})
);

// GET ALL ONE USER SUBJECTS
controller.get(
	'/getAll/subjects/:id',
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;
		const data = await AdminModel.findById(id).populate('_subjects');

		if (!data) {
			throw new Error('Gagal memuat data!');
		}

		res.status(200).json({ data: data });
	})
);

// GET ALL CPMKS
controller.get(
	'/getAll/cpmks',
	asyncHandler(async (req, res, next) => {
		const data = await SubjectModel.find().populate('_cpmks');

		if (!data) {
			throw new Error('Gagal memuat data!');
		}

		res.status(200).json({ data: data });
	})
);

// GET USER BY ID
controller.get(
	'/getOne/:id',
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;
		const data = await AdminModel.findById(id);

		if (!data) {
			throw new Error('Gagal memuat data!');
		}

		res.status(200).json({ data: data });
	})
);

// LOGIN USER
controller.post(
	'/login',
	asyncHandler(async (req, res, next) => {
		const { email, password } = req.body;

		const user = await AdminModel.findOne({ email });

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

// REGISTER USER
controller.post(
	'/register',
	asyncHandler(async (req, res, next) => {
		const { fullName, email, password } = req.body;

		const userEmail = await AdminModel.findOne({ email });

		if (userEmail) {
			res.status(402);
			throw new Error('Email sudah digunakan!');
		}

		const user = new AdminModel({ fullName, email, password });

		await user
			.save()
			.then((user) => {
				res.status(200).json({
					data: user,
					token: generateToken(user._id),
				});
			})
			.catch((error) => next(error));
	})
);

// INPUT SUBJECTS
controller.post(
	'/input-matkul/:id',
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;

		await AdminModel.findById(id)
			.then((admin) => {
				const newSubject = new SubjectModel(req.body);
				newSubject._admin = admin._id;
				admin._subjects.push(newSubject);
				admin
					.save()
					.then((data) => {
						newSubject
							.save()
							.then((data) => {
								res.status(200).json({
									data: data,
								});
							})
							.catch((err) => {
								next(err);
							});
					})
					.catch((err) => {
						next(err);
					});
			})
			.catch((err) => next(err));
	})
);

// INPUT RPS/CPMK
controller.post(
	'/input-rps/:idSubject',
	asyncHandler(async (req, res, next) => {
		const { idSubject } = req.params;

		await SubjectModel.findById(idSubject)
			.then((subject) => {
				const newCpmk = new CpmkModel(req.body);
				newCpmk._subject = subject._id;
				subject._cpmks.push(newCpmk);
				subject
					.save()
					.then((data) => {
						newCpmk
							.save()
							.then((data) => {
								res.status(200).json({
									data: data,
								});
							})
							.catch((err) => {
								next(err);
							});
					})
					.catch((err) => {
						next(err);
					});
			})
			.catch((err) => next(err));
	})
);

// DELETE USER
controller.delete(
	'/delete/:id',
	asyncHandler(async (req, res, next) => {
		const id = req.params.id;
		const data = await AdminModel.findByIdAndDelete(id);

		if (!data) {
			throw new Error('Not found!');
		}
		res.status(200).json({
			message: `User dengan nama: ${data.fullName}, telah dihapus`,
		});
	})
);

module.exports = controller;

// optimasi google
// web dev optimize
// google dev optimize
// web.dev/fast
// web.dev/seo
