const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const extRoute = require('./routes/ext');
const userRoute = require('./routes/user');
const curriculumRoute = require('./routes/curriculum');
const courseRoute = require('./routes/course');
const ttgenRoute = require('./routes/ttgen');

const User = require('./models/User');

const user = require('./utility/userUtility');
const { logger, expressWinstonLogger } = require('./utility/loggers.js');

const GOOGLE_CLIENT_ID = "524977778563-rqfsuge27b7se639i2n4ellt82uhtosv.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "UUNrcLqOXmnP_HweyJirA9VA";

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;

if (!process.env.NODE_UN)
	mongoose.connect("mongodb://localhost:27017/FFCS", { useFindAndModify: false });
else
	mongoose.connect(`mongodb://${process.env.NODE_UN}:${process.env.NODE_PW}@localhost:27017/FFCS`, { useFindAndModify: false });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("Connected to MongoDB Instance");
});


passport.serializeUser(function (user, done) {
	return done(null, user);
});

passport.deserializeUser(async function (doc, done) {
	try {
		var userDoc = await user.findUserByID(doc._id);
		return done(null, userDoc);
	} catch(err) {
		return done(err, false);
	}
});

passport.use(new GoogleStrategy({
	clientID: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.NODE_BASE_URL + "/auth/google/callback",
	passReqToCallback: true
},
	async function (request, accessToken, refreshToken, profile, done) {
		var update_data = {
			google_id: profile.id,
			display_name: profile.displayName,
			email: profile.email,
			picture: profile.picture,
			timestamp: Date.now()
		};

		var query_data = { google_id: profile.id }
		
		try {
			var newDoc = await user.updateUser(query_data, update_data, true, true, true);
			return done(null, newDoc);
		} catch(err) {
			if(err) return done(err, false);
		}
	}
));


// and create our instances
const app = express();
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use(session({
	secret: 'foo',
	store: new mongoStore({ mongooseConnection: db }),
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 14 * 24 * 60 * 60 * 100 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.use(expressWinstonLogger);

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	
	if (req.method === 'OPTIONS') { return res.status(200).end(); }
	
	next();
});

app.use('/ext', ensureAuthenticated, extRoute);
app.use('/curriculum', ensureAuthenticated, curriculumRoute);
app.use('/course', ensureAuthenticated, courseRoute);
app.use('/user', ensureAuthenticated, userRoute);
app.use('/ttgen', ensureAuthenticated, ttgenRoute);

app.get('/account', ensureAuthenticated, function (req, res) {
	var data = {
		google_id: req.user.google_id,
		display_name: req.user.display_name,
		email: req.user.email,
		picture: req.user.picture,

		vtopSignedIn: req.user.vtopSignedIn,
	}
	// res.json({ success: true, data: data });
	return res.json(data);
});



app.get('/auth/google', passport.authenticate('google', {
	scope: [
		'email', 'profile']
}));

app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: '/dashboard',
		failureRedirect: '/'
	}));

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/dashboard', redirectUnauthenticated, function(req, res) {
	res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));		
});

app.get('/about', function(req, res) {
	res.sendFile(path.join(__dirname, 'about.txt'));
})

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.get('/*', function (req, res) {
	res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	req.authenticated = req.isAuthenticated();

	if (req.isAuthenticated()) { 
		return next(); 
	}
	
	res.status(401).json({ success: false, authenticated: false });
}

function redirectUnauthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.redirect('/');
}

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
