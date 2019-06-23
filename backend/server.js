const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const  mongoStore = require('connect-mongo')(session);
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;


const extRoute = require('./routes/ext');
const userRoute = require('./routes/user');
const curriculumRoute = require('./routes/curriculum');
const courseRoute = require('./routes/course');
const ttgenRoute = require('./routes/ttgen');

const User = require('./models/User');

const user = require('./utility/userUtility');

const GOOGLE_CLIENT_ID = "524977778563-rqfsuge27b7se639i2n4ellt82uhtosv.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "UUNrcLqOXmnP_HweyJirA9VA";


passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(async function (doc, done) {
	try {
		var userDoc = await user.findUserByID(doc._id);
		return done(null, userDoc);
	} catch(err) {
		return done(err, false);
	}
	// User.findById(doc._id, function(err, user) {
	// 	done(err, user);
	// });
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
	callbackURL: process.env.NODE_BASE_URL + "/auth/google/callback",
	passReqToCallback: true
},
	function (request, accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(async function () {
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
			// User.findOneAndUpdate(
			// 	query_data, 
			// 	update_data, 
			// 	{ upsert: true, new: true, setDefaultsOnInsert: true },
			// 	function(err, doc) {
			// 		if(err) return done(err, false);
			// 		return done(null, doc);
			// 	});

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

if(!process.env.NODE_UN)
	mongoose.connect("mongodb://localhost:27017/FFCS", { useFindAndModify: false });
else
	mongoose.connect(`mongodb://${process.env.NODE_UN}:${process.env.NODE_PW}@localhost:27017/FFCS`, { useFindAndModify: false });
	
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

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(logger('dev'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
	res.json(data);
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

function redirectUnauthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.redirect('/');
}

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));