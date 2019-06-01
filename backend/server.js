import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
var  mongoStore = require('connect-mongo')(session);
import passport from 'passport';
var GoogleStrategy = require('passport-google-oauth2').Strategy;


import extRoute from './routes/ext';
import userRoute from './routes/user';
import curriculumRoute from './routes/curriculum';
import courseRoute from './routes/course';

import User from './models/User';

const GOOGLE_CLIENT_ID = "524977778563-rqfsuge27b7se639i2n4ellt82uhtosv.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "UUNrcLqOXmnP_HweyJirA9VA";


passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (doc, done) {
	User.findById(doc._id, function(err, user) {
		done(err, user);
	});
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
	clientID: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	//NOTE :
	//Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
	//The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
	//then edit your /etc/hosts local file to point on your private IP. 
	//Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
	//if you use it.
	callbackURL: "http://localhost:3001/auth/google/callback",
	passReqToCallback: true
},
	function (request, accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {
			var user_google_data = {
				google_id: profile.id,
				display_name: profile.displayName,
				email: profile.email,
				picture: profile.picture,
			};
			User.findOneAndUpdate(
				{ google_id: profile.id }, 
				user_google_data, 
				{ upsert: true, new: true },
				function(err, doc) {
					if(err) return done(err, false);
					return done(null, doc);
				});

			// To keep the example simple, the user's Google profile is returned to
			// represent the logged-in user.  In a typical application, you would want
			// to associate the Google account with a user record in your database,
			// and return that user instead.
			// return done(null, profile);
		});
	}
));



// and create our instances
const app = express();

mongoose.connect("mongodb://localhost:27017/FFCS", { useFindAndModify: false });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("Connected to MongoDB Instance");
});

app.use(session({
	secret: 'foo',
	store: new mongoStore({ mongooseConnection: db }),
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 14 * 24 * 60 * 60 * 100 }
}));

app.use(passport.initialize());
app.use(passport.session());

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(logger('dev'));

app.use('/ext', extRoute);
app.use('/curriculum', curriculumRoute);
app.use('/course', courseRoute);

app.get('/', function (req, res) {
	res.send(`Index<br>` + req.user);
});

app.get('/account', ensureAuthenticated, function (req, res) {
	res.json(req.user);
});

app.get('/login', function (req, res) {
	res.send(`Login<br>` + req.user);
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', {
	scope: [
		'email', 'profile']
}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
	req.authenticated = req.isAuthenticated();

	if (req.isAuthenticated()) { 
		return next(); 
	}
	
	res.status(401).json({ success: false, authenticated: false });
}

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));