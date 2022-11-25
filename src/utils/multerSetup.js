const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads');
	},

	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'application/pdf',
	];
	if (allowedFileTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('.jpg / .jpeg / .png only'));
	}
};

// nama parameter di dalam single harus sama dengan input name di front end :)
const upload = multer({ storage, fileFilter }).single('file');

module.exports = upload;
