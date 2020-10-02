const consts = require('./constants');

function ensureAuthenticated(req, res, next) {
	req.authenticated = req.isAuthenticated();

	if (req.isAuthenticated()) {
		return next();
	}

	try {
		throw new Error(consts.messages.notAuth);
	} catch (err) {
		return res.status(401).json(consts.failJson(consts.messages.notAuth));
	}
}

function ensureAdmin(req, res, next) {
	if (req.user.scopes.includes(consts.userScopes.admin)) {
		return next();
	}

	try {
		throw new Error(consts.messages.notAdmin);
	} catch (err) {
		return res.status(401).json(consts.failJson(consts.messages.notAdmin));
	}
}

module.exports = {
	ensureAuthenticated,
	ensureAdmin,
};
