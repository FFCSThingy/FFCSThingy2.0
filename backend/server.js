require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const extRoute = require('./routes/ext');
const userRoute = require('./routes/user');
const curriculumRoute = require('./routes/curriculum');
const courseRoute = require('./routes/course');
const ttgenRoute = require('./routes/ttgen');

const userUtility = require('./utility/userUtility');
const consts = require('./utility/constants');
const { logger, expressWinstonLogger } = require('./utility/loggers.js');

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;

if (process.env.NODE_MONGO_URL) {
	mongoose.connect(`${process.env.NODE_MONGO_URL}/${process.env.NODE_MONGO_DB}?retryWrites=true&w=majority`, {
		useFindAndModify: false,
		useUnifiedTopology: true,
		useNewUrlParser: true,
	});
} else if (process.env.NODE_MONGO_UN) {
	mongoose.connect(
		`mongodb://${process.env.NODE_MONGO_UN}:${process.env.NODE_MONGO_PW}@localhost:27017/FFCS`,
		{ useFindAndModify: false },
	);
} else {
	mongoose.connect('mongodb://localhost:27017/FFCS', { useFindAndModify: false });
}

const db = mongoose.connection;

db.on('error', logger.error.bind(logger, 'connection error:'));
db.once('open', () => {
	logger.info('Connected to MongoDB Instance');
});

function ensureAuthenticated(req, res, next) {
	req.authenticated = req.isAuthenticated();

	if (req.isAuthenticated()) {
		return next();
	}

	return res.status(401).json(consts.failJson(consts.messages.notAuth));
}

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser(async (doc, done) => {
	try {
		const userDoc = await userUtility.findUserByID(doc._id);
		return done(null, userDoc);
	} catch (err) {
		return done(err, false);
	}
});

passport.use(new GoogleStrategy({
	clientID: process.env.NODE_GOOGLE_CLIENT_ID,
	clientSecret: process.env.NODE_GOOGLE_CLIENT_SECRET,
	callbackURL: `${process.env.NODE_BASE_URL}/auth/google/callback`,
	passReqToCallback: true,
},
(async (request, accessToken, refreshToken, profile, done) => {
	const updateData = {
		google_id: profile.id,
		display_name: profile.displayName,
		email: profile.email,
		picture: profile.picture,
		timestamp: Date.now(),
	};

	const queryData = { google_id: profile.id };

	try {
		const newDoc = await userUtility.updateUser(queryData, updateData, true, true, true);
		return done(null, newDoc);
	} catch (err) {
		return done(err, false);
	}
})));


const app = express();

app.use(session({
	secret: 'foo',
	store: new MongoStore({ mongooseConnection: db }),
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 14 * 24 * 60 * 60 * 100 },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.use(expressWinstonLogger);

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

	if (req.method === 'OPTIONS') { return res.status(200).end(); }

	return next();
});

app.use('/ext', ensureAuthenticated, extRoute);
app.use('/curriculum', ensureAuthenticated, curriculumRoute);
app.use('/course', ensureAuthenticated, courseRoute);
app.use('/user', ensureAuthenticated, userRoute);
app.use('/ttgen', ensureAuthenticated, ttgenRoute);

app.get('/account', ensureAuthenticated, (req, res) => {
	const data = {
		google_id: req.user.google_id,
		display_name: req.user.display_name,
		email: req.user.email,
		picture: req.user.picture,

		vtopSignedIn: req.user.vtopSignedIn,
	};
	return res.json({ success: true, data });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login',
	}));

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

app.get('/about', (req, res) => {
	res.sendFile(path.join(__dirname, 'about.txt'));
});

app.listen(API_PORT, () => logger.info(`Listening on port ${API_PORT}`));
