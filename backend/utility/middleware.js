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

module.exports = ensureAuthenticated;
