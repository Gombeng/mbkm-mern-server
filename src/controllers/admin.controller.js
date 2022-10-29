const AdminModel = require('../models/admin.model');
const controller = require('express')();
// gunakan modul ini supaya tidak perlu ribet return error
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const upload = require('../utils/multerSetup');

//endpoint untuk mendapatkan semua user
controller.get(
	'/getAll',
	asyncHandler(async (req, res, next) => {
		// ambil semua data mahasiswa yang ada di db
		const data = await AdminModel.find();

		// data not found
		if (!data) {
			throw new Error('Gagal memuat data!');
		}

		// respon dari server berupa data mahasiswa
		res.status(200).json(data);
	})
);

// endpoint untuk mendapatkan satu user berdasarkan id
controller.get(
	// get data berdasarkan id, lihat ujung urlnya :id
	'/getOne/:id',
	asyncHandler(async (req, res, next) => {
		// jadi di sini nanti pas req.params.(harus sama dengan yang di ujung url)
		const { id } = req.params;
		const data = await AdminModel.findById(id);

		// data not found
		if (!data) {
			throw new Error('Gagal memuat data!');
		}

		// respon dari server berupa data mahasiswa
		res.status(200).json(data);
	})
);

//endpoint untuk melakukan login
controller.post(
	'/login',
	asyncHandler(async (req, res, next) => {
		// request ke server untuk dapatkan varibel ini
		const { email, password } = req.body;

		// cari satu user berdasarkan email
		const user = await AdminModel.findOne({ email });

		if (!user) {
			res.status(404);
			throw new Error('Pengguna tidak ditemukan!');
		}

		// jika user ada dan password = dengan yang di db, jalankan ini
		if (user && (await user.matchPassword(password))) {
			// dapatkan respon balik berformat json dari server berisi data ini
			// const { _id, email, fullName, nim, programMBKM, skAcc, borangKonversi } =
			// 	user;

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

//endpoint untuk melakukan register
controller.post(
	'/register',
	asyncHandler(async (req, res, next) => {
		// request ke server untuk dapatkan varibel ini
		const { fullName, email, password } = req.body;

		// cari satu user berdasarkan email
		const userEmail = await AdminModel.findOne({ email });

		// jika email user ada di db, jalankan ini
		if (userEmail) {
			res.status(402);
			throw new Error('Email sudah digunakan!');
		}

		// buat model baru dan simpan kedalam variabel data
		const user = new AdminModel({ fullName, email, password });

		// tunggu modelnya di save
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

// TODO: endpoint untuk input matkul
controller.post(
	'/input-matkul/:id',
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;
		const { code, name } = req.body;
		const subject = { code: code, name: name };

		// const user = await AdminModel.findById(id);
		// user.subject.push(subject);

		// * DONE
		const user = await AdminModel.findByIdAndUpdate(id, {
			$push: { subjects: subject },
		})
			.then((user) => {
				res.status(200).json({
					data: user,
				});
			})
			.catch((error) => next(error));
	})
);

// TODO: endpoint untuk isi rps matkul
controller.post(
	'/isi-rps/:idAdmin/:idMatkul',
	asyncHandler(async (req, res, next) => {
		const { idAdmin, idMatkul } = req.params;

		const { id } = req.params;
		const { code, name } = req.body;
		const subject = { code: code, name: name };

		// * CONFUSE: data baru akan masuk/disimpan setelah disubmit 2 kali, rada aneh
		// const user = await AdminModel.update(
		// 	{ _id: id },
		// 	{
		// 		$push: { subjects: subject },
		// 	}
		// )
		// 	.then((user) => {
		// 		res.status(200).json({
		// 			data: user,
		// 		});
		// 	})
		// 	.catch((error) => next(error));
	})
);

// endpoint untuk menghapus user dari db
controller.delete(
	'/delete/:id',
	asyncHandler(async (req, res, next) => {
		const id = req.params.id;
		const data = await AdminModel.findByIdAndDelete(id);

		// data not found
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
