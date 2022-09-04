require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const app = express();
const routes = require('./src/routes/routes');

app.use(cors());
app.use(express.json());
app.use(routes);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// middleware handling error
app.use((error, req, res, next) => {
	const status = error.errorStatus || 500;
	const message = error.message;
	const data = error.data;

	res.status(status).json({ message, data })
})


const PORT = process.env.PORT || 5000;
const DB = process.env.DB || 5000;
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose
	.connect(DB, options)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`🔥 Server running on http://localhost:${PORT} 🔥`);
		});

		app.get('/', (req, res) => {
			res.send(`Hello World 🔥🔥🔥`);
		});
	})
	.catch((err) => console.log('error => ', err));
