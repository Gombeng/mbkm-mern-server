const controller = require('express')();
const ImgModel = require('../models/img.model');
// gunakan modul ini supaya tidak perlu ribet return error
const asyncHandler = require('express-async-handler');
const upload = require('../utils/multerSetup');

//endpoint untuk mendapatkan semua gambar
controller.get(
	'/getAll',
	asyncHandler(async (req, res, next) => {
		// ambil semua data mahasiswa yang ada di db
		const data = await ImgModel.find();

		// data not found
		if (!data) {
			throw new Error('Gagal memuat gambar!');
		}

		// respon dari server berupa data mahasiswa
		res.status(200).json(data);
	})
);

// endpoint untuk mendapatkan satu gambar berdasarkan id
controller.get(
	// get data berdasarkan id, lihat ujung urlnya :id
	'/getOne/:id',
	asyncHandler(async (req, res, next) => {
		// jadi di sini nanti pas req.params.(harus sama dengan yang di ujung url)
		const { id } = req.params;
		const data = await ImgModel.findById(id);

		// data not found
		if (!data) {
			throw new Error('Gagal memuat gambar!');
		}

		// respon dari server berupa data mahasiswa
		res.status(200).json(data);
	})
);

//endpoint untuk melakukan register
controller.post(
	'/add-img',
	upload,
	asyncHandler(async (req, res, next) => {
		if (!req.file) {
			throw new Error('Select an image!');
		}

		const image = req.file.path;

		// buat model baru dan simpan kedalam variabel image
		const data = new ImgModel({ image });

		// tunggu modelnya di save
		await data
			.save()
			.then((data) => {
				res.status(200).json({
					data,
				});
			})
			.catch((error) => next(error));
	})
);

// endpoint untuk menghapus image
controller.delete(
	'/delete/:id',
	asyncHandler(async (req, res, next) => {
		const id = req.params.id;
		const data = await ImgModel.findByIdAndDelete(id);

		// data not found
		if (!data) {
			throw new Error('Not found!');
		}

		res.status(200).json({
			message: `Gambar telah dihapus`,
		});
	})
);

module.exports = controller;

// optimasi google
// web dev optimize
// google dev optimize
// web.dev/fast
// web.dev/seo
