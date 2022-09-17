const MhsModel = require('../models/mhs.model');
const controller = require('express')();
// gunakan modul ini supaya tidak perlu ribet return error
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const upload = require('../utils/multerSetup');

//endpoint untuk melakukan login
controller.post(
	'/login',
	asyncHandler(async (req, res, next) => {
		// request ke server untuk dapatkan varibel ini
		const { email, password } = req.body;

		// cari satu user berdasarkan email
		const user = await MhsModel.findOne({ email });

		if (!user) {
			res.status(404);
			throw new Error('Pengguna tidak ditemukan!');
		}

		// jika user ada dan password = dengan yang di db, jalankan ini
		if (user && (await user.matchPassword(password))) {
			// dapatkan respon balik berformat json dari server berisi data ini
			res.status(200).json({
				user,
				token: generateToken(user._id),
				message: 'Sukses login',
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
		const { nim, fullName, email, password } = req.body;

		// cari satu user berdasarkan email
		const userEmail = await MhsModel.findOne({ email });
		const userNim = await MhsModel.findOne({ nim });

		// jika email user ada di db, jalankan ini
		if (userEmail) {
			res.status(402);
			throw new Error('Email sudah digunakan!');
		}

		// jika nim user ada di db, jalankan ini
		if (userNim) {
			res.status(402);
			throw new Error('Nim sudah digunakan!');
		}

		// buat model baru dan simpan kedalam variabel data
		const user = new MhsModel({ nim, fullName, email, password });

		// tunggu modelnya di save
		await user.save();
		// dapatkan respon balik berformat json dari server berisi user ini
		res.status(200).json(user);
	})
);

//endpoint untuk mendapatkan semua user
controller.get(
	'/getAll',
	asyncHandler(async (req, res, next) => {
		// ambil semua data mahasiswa yang ada di db
		const data = await MhsModel.find();

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
		const data = await MhsModel.findById(req.params.id);

		// data not found
		if (!data) {
			throw new Error('Gagal memuat data!');
		}

		// respon dari server berupa data mahasiswa
		res.status(200).json(data);
	})
);

// endpoint untuk update/edit data user
controller.patch(
	'/update/:id',
	// jangan lupa pasang middleware ini
	upload,
	asyncHandler(async (req, res, next) => {
		const id = req.params.id;
		// const {fullName, nim, email} = req.body;
		const update = req.body;
		// const skAcc = req.file.path;
		const options = { new: true };

		const data = await MhsModel.findByIdAndUpdate(id, update, options);

		// data not found
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		// if (!req.file) return res.send('Please upload a file')
		res.status(200).send(data);
	})
);

// endpoint untuk menghapus user dari db
controller.delete(
	'/delete/:id',
	asyncHandler(async (req, res, next) => {
		const id = req.params.id;
		const data = await MhsModel.findByIdAndDelete(id);

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
