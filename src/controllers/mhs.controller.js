const MhsModel = require('../models/mhs.model');
const controller = require('express')();
// gunakan modul ini supaya tidak perlu ribet return error
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');

//endpoint untuk melakukan login
controller.post(
	'/login',
	asyncHandler(async (req, res, next) => {
		// request ke server untuk dapatkan varibel ini
		const { email, password } = req.body;

		// cari satu user berdasarkan email
		const user = await MhsModel.findOne({ email });

		// jika user ada dan password = dengan yang di db, jalankan ini
		if (user && (await user.matchPassword(password))) {
			// dapatkan respon balik berformat json dari server berisi data ini
			res.status(200).json({
				_id: user._id,
				nim: user.nim,
				fullName: user.fullName,
				email: user.email,
				skMitra: user.skMitra,
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
		const data = new MhsModel({ nim, fullName, email, password });

		// tunggu modelnya di save
		await data.save();
		// dapatkan respon balik berformat json dari server berisi data ini
		res.status(200).json({
			data,
			message: 'Sukses menambahkan pengguna baru',
		});
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
	asyncHandler(async (req, res, next) => {
		const id = req.params.id;
		const updatedData = req.body;
		const options = { new: true };

		const data = await MhsModel.findByIdAndUpdate(id, updatedData, options);

		// data not found
		if (!data) {
			throw new Error('Gagal memuat data!');
		}
		res.send(data);
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
