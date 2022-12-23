const controller = require('express')();
// gunakan modul ini supaya tidak perlu ribet return error
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const upload = require('../utils/multerSetup');
const { CpmkModel, SubjectModel } = require('../models/admin.model');
const {
	MhsModel,
	AnswerModel,
	BorangModel,
	LogsheetModel,
	accEnum,
} = require('../models/mahasiswa');

/*
 * endpoint untuk mendapatkan semua mahasiswa
 */
controller.get(
	'/',
	asyncHandler(async (req, res, next) => {
		const data = await MhsModel.find().populate({
			path: 'idBorangs',
			populate: {
				path: 'idAnswers',
				model: 'answer',
			},
		});
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk mendapatkan mahasiswa berdasarkan id nya
 */
controller.get(
	'/:idMahasiswa',
	asyncHandler(async (req, res, next) => {
		const { idMahasiswa } = req.params;
		const data = await MhsModel.findById(idMahasiswa).populate({
			path: 'idBorangs',
			populate: {
				path: 'idAnswers',
				model: 'answer',
			},
		});
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk melaukan login mahasiswa
 */
controller.post(
	'/login',
	asyncHandler(async (req, res, next) => {
		const { email, password } = req.body;
		const user = await MhsModel.findOne({ email });
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
 * endpoint untuk melakukan register mahasiswa
 */
controller.post(
	'/register',
	asyncHandler(async (req, res, next) => {
		const { nim, fullName, email, password } = req.body;
		const userEmail = await MhsModel.findOne({ email });
		const userNim = await MhsModel.findOne({ nim });
		if (userEmail) {
			res.status(402);
			throw new Error('Email sudah digunakan!');
		}
		if (userNim) {
			res.status(402);
			throw new Error('Nim sudah digunakan!');
		}
		const user = new MhsModel({ nim, fullName, email, password });
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

/*
 * endpoint untuk upload surat keterangan diterima mitra
 */
controller.patch(
	'/sk-mitra/:idMahasiswa',
	// Todo: jangan lupa pasang middleware ini
	// upload,
	asyncHandler(async (req, res, next) => {
		const { idMahasiswa } = req.params;
		const options = { new: true };

		const data = await MhsModel.findByIdAndUpdate(
			idMahasiswa,
			{ skAcc: req.body },
			options
		);
		res.status(200).send({ data });
	})
);
// controller.patch(
// 	'/sk-mitra/:idMahasiswa',
// 	// Todo: jangan lupa pasang middleware ini
// 	upload,
// 	asyncHandler(async (req, res, next) => {
// 		const { idMahasiswa } = req.params;
// 		const { programMbkm } = req.body;
// 		const image = req.file.path;
// 		const options = { new: true };
// 		if (!req.file) {
// 			throw new Error('Select an image!');
// 		}
// 		const data = await MhsModel.findByIdAndUpdate(
// 			idMahasiswa,
// 			{ skAcc: image, programMbkm: programMbkm },
// 			options
// 		);
// 		res.status(200).send({ data });
// 	})
// );

/*
 * endpoint untuk upload logsheet/logbook harian mahasiswa
 */
controller.post(
	'/upload-logsheet/:idMahasiswa',
	asyncHandler(async (req, res, next) => {
		const { idMahasiswa } = req.params;
		const { logsheet } = req.body;
		const options = { new: false };

		await MhsModel.findById(idMahasiswa)
			.then(async (mahasiswa) => {
				mahasiswa.logsheet.push(logsheet);
				await mahasiswa
					.save()
					.then((data) => res.status(200).send({ data }))
					.catch((err) => next(err));
			})
			.catch((err) => next(err));
	})
);

/*
 * endpoint untuk upload laporan akhir mahasiswa
 */
controller.patch(
	'/upload-laporan-akhir/:idMahasiswa',
	asyncHandler(async (req, res, next) => {
		const { idMahasiswa } = req.params;
		const options = { new: true };

		const data = await MhsModel.findByIdAndUpdate(
			idMahasiswa,
			{ laporanAkhir: req.body },
			options
		);
		res.status(200).send({ data });
	})
);

/*
 * endpoint untuk mendapatkan semua borang mahasiswa
 */
controller.get(
	'/getAll/borangs',
	asyncHandler(async (req, res, next) => {
		const data = await BorangModel.find();
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk mendapatkan satu borang berdasarkan id borang
 */
controller.get(
	'/borangs/:idBorang',
	asyncHandler(async (req, res, next) => {
		const { idBorang } = req.params;
		const data = await BorangModel.findById(idBorang);
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk mendapatkan semua borang berdasarkan id mahasiswa (populate)
 */
controller.get(
	'/student-borangs/:idMahasiswa',
	asyncHandler(async (req, res, next) => {
		const { idMahasiswa } = req.params;
		const data = await MhsModel.findById(idMahasiswa).populate({
			path: 'idBorangs',
			populate: {
				path: 'idAnswers',
				model: 'answer',
			},
		});
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk mendapatkan answer di semua borang berdasarkan id borang
 */
controller.get(
	'/borangs/answers/:idBorang',
	asyncHandler(async (req, res, next) => {
		const { idBorang } = req.params;
		const data = await BorangModel.findById(idBorang).populate('idAnswers');
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.status(200).json({ data });
	})
);

/*
 * endpoint untuk acc borang by admin
 */
controller.post(
	'/acc-borang-by-admin/:idBorang',
	asyncHandler(async (req, res, next) => {
		const { idBorang } = req.params;
		await BorangModel.findById(idBorang)
			.then((borang) => {
				borang.statusDosen = accEnum.acc;
				borang
					.save()
					.then((data) => {
						newBorang
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
 * endpoint untuk dec borang by admin
 */
controller.post(
	'/dec-borang-by-admin/:idBorang',
	asyncHandler(async (req, res, next) => {
		const { idBorang } = req.params;
		await BorangModel.findById(idBorang)
			.then((borang) => {
				borang.statusDosen = accEnum.decline;
				borang
					.save()
					.then((data) => {
						newBorang
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
 * endpoint untuk acc borang by super admin
 */
controller.post(
	'/acc-borang-by-superadmin/:idBorang',
	asyncHandler(async (req, res, next) => {
		const { idBorang } = req.params;
		await BorangModel.findById(idBorang)
			.then((borang) => {
				borang.statusKajur = accEnum.acc;
				borang
					.save()
					.then((data) => {
						newBorang
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
 * endpoint untuk dec borang by super admin
 */
controller.post(
	'/dec-borang-by-superadmin/:idBorang',
	asyncHandler(async (req, res, next) => {
		const { idBorang } = req.params;
		await BorangModel.findById(idBorang)
			.then((borang) => {
				borang.statusKajur = accEnum.decline;
				borang
					.save()
					.then((data) => {
						newBorang
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
 * endpoint untuk membuat borang baru di satu mahasiswa
 */
controller.post(
	'/buat-borang/:idStudent',
	asyncHandler(async (req, res, next) => {
		const { idStudent } = req.params;
		const { subject } = req.body;
		await MhsModel.findById(idStudent)
			.then((mhs) => {
				const newBorang = new BorangModel(req.body);
				newBorang.idStudent = mhs._id;
				mhs.idBorangs.push(newBorang);
				mhs
					.save()
					.then((data) => {
						newBorang
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
 * endpoint untuk mengisi answer berdasarkan id borang
 */
controller.post(
	'/isi-cpmk/:idBorang',
	asyncHandler(async (req, res, next) => {
		const { idBorang } = req.params;
		await BorangModel.findById(idBorang)
			.then((borang) => {
				const newAnswer = new AnswerModel(req.body);
				borang.idAnswers.push(newAnswer);
				borang
					.save()
					.then((data) => {
						newAnswer
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
 * endpoint untuk menghapus answer berdasarkan id nya
 */
controller.delete(
	'/hapus-cpmk/:idAnswer',
	asyncHandler(async (req, res, next) => {
		const { idAnswer } = req.params;
		await AnswerModel.findByIdAndDelete(idAnswer)
			.then((data) => {
				res.status(200).json({ data });
			})
			.catch((error) => {
				next(error);
			});
	})
);

/*
 * endpoint untuk update/edit info mahasiswa
 */
controller.patch(
	'/edit-profil/:idMahasiswa',
	asyncHandler(async (req, res, next) => {
		const { idMahasiswa } = req.params;
		const options = { new: true };
		const data = await MhsModel.findByIdAndUpdate(
			idMahasiswa,
			req.body,
			options
		);
		res.status(200).send({ data });
	})
);

/*
 * endpoint untuk menghapus satu mahasiswa
 */
controller.delete(
	'/hapus-student/:idStudent',
	asyncHandler(async (req, res, next) => {
		const { idStudent } = req.params;
		const data = await MhsModel.findByIdAndDelete(idStudent);
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
