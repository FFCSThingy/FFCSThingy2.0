import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';

import ext from './routes/ext';

// and create our instances
const app = express();

mongoose.connect("mongodb://localhost:27017/FFCS");
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("Connected to MongoDB Instance");
});

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(logger('dev'));

app.use('/ext', ext);

app.get('/', (req, res) => {
	res.json({ message: 'Hello, World!' });
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));