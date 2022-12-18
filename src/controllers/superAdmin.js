const {
	AdminModel,
	SubjectModel,
	CpmkModel,
} = require('../models/admin.model');
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
		const data = await AdminModel.find();
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk mendapatkan satu admin
 */
controller.get(
	'/:idAdmin',
	asyncHandler(async (req, res, next) => {
		const { idAdmin } = req.params;
		const data = await AdminModel.findById(idAdmin);
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

/*
 * endpoint untuk register admin
 */
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
			.then((data) => {
				res.status(200).json({
					data,
					token: generateToken(data._id),
				});
			})
			.catch((error) => next(error));
	})
);

/*
 * endpoint untuk mendapatkan semua mata kuliah (populate)
 */
controller.get(
	'/subjects',
	asyncHandler(async (req, res, next) => {
		const data = await AdminModel.find().populate('idSubjects');
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk mendapatkan semua mata kuliah satu dosen (pupulate)
 */
controller.get(
	'/subjects/:idAdmin',
	asyncHandler(async (req, res, next) => {
		const { idAdmin } = req.params;
		const data = await AdminModel.findById(idAdmin).populate('idSubjects');
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk mendapatkan semua cpmk di semua mata kuliah (populate)
 */
controller.get(
	'/getAll/cpmks',
	asyncHandler(async (req, res, next) => {
		const data = await SubjectModel.find().populate('idCpmks');
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk mendapatkan semua cpmk di satu mata kuliah (populate)
 */
controller.get(
	'/getOne/subjects/:name',
	asyncHandler(async (req, res, next) => {
		const { name } = req.params;
		const data = await SubjectModel.find({ name: name }).populate('idCpmks');
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk mendapatkan satu cpmk
 */
controller.get(
	'/cpmks/:idCpmk',
	asyncHandler(async (req, res, next) => {
		const { idCpmk } = req.params;
		const data = await CpmkModel.findById(idCpmk);
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk mendapatkan semua cpmk di satu mata kuliah (populate)
 */
controller.get(
	'/cpmks/:idSubject',
	asyncHandler(async (req, res, next) => {
		const { idSubject } = req.params;
		const data = await SubjectModel.findById(idSubject).populate('idCpmks');
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk input mata kuliah
 */
controller.post(
	'/input-matkul/:idAdmin',
	asyncHandler(async (req, res, next) => {
		const { idAdmin } = req.params;

		await AdminModel.findById(idAdmin)
			.then((admin) => {
				const newSubject = new SubjectModel(req.body);
				newSubject.idAdmin = admin._id;
				admin.idSubjects.push(newSubject);
				admin
					.save()
					.then((data) => {
						newSubject
							.save()
							.then((data) => {
								res.status(200).json({ data });
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

/*
 * endpoint untuk input rps atau cpmk
 */
controller.post(
	'/input-rps/:idSubject',
	asyncHandler(async (req, res, next) => {
		const { idSubject } = req.params;

		await SubjectModel.findById(idSubject)
			.then((subject) => {
				const newCpmk = new CpmkModel(req.body);
				newCpmk.idSubject = subject._id;
				subject.idCpmks.push(newCpmk);
				subject
					.save()
					.then((data) => {
						newCpmk
							.save()
							.then((data) => {
								res.status(200).json({ data });
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

/*
 * endpoint untuk hapus rps
 */
controller.delete(
	'/hapus-cpmk/:idCpmk',
	asyncHandler(async (req, res, next) => {
		const { idCpmk } = req.params;
		const data = await CpmkModel.findByIdAndDelete(idCpmk);

		if (!data) {
			throw new Error('Not found!');
		}
		res.status(200).json({
			message: `User dengan nama: ${data.name}, telah dihapus`,
		});
	})
);

/*
 * endpoint untuk hapus subject
 */
controller.delete(
	'/hapus-subject/:idSubject',
	asyncHandler(async (req, res, next) => {
		const { idSubject } = req.params;
		const data = await SubjectModel.findByIdAndDelete(idSubject);

		if (!data) {
			throw new Error('Not found!');
		}
		res.status(200).json({
			message: `User dengan nama: ${data.name}, telah dihapus`,
		});
	})
);

/*
 * endpoint untuk hapus admin
 */
controller.delete(
	'/delete/:idAdmin',
	asyncHandler(async (req, res, next) => {
		const { idAdmin } = req.params;
		const data = await AdminModel.findByIdAndDelete(idAdmin);

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
