require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const app = express();
const routes = require('./src/routes/routes');

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// middleware handling error
app.use((error, req, res, next) => {
	const status = error.errorStatus || 500;
	const message = error.message;
	const data = error.data;

	res.status(status).json({ message, data });
});

const { DB, PORT } = process.env;
const connectionParams = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose
	.connect(DB, connectionParams)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`🔥 http://localhost:${PORT}`);
		});
		app.get('/', (req, res) => {
			res.send(`Hello World 🔥🔥🔥`);
		});
	})
	.catch((err) => console.log('error => ', err));
