const winston = require('winston');
const expressWinston = require('express-winston');

const winstonLevels = {
	error: 0,
	warn: 1,
	info: 2,
	verbose: 3,
	debug: 4,
	silly: 5
};

module.exports.logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	],
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.simple()
	)
});

module.exports.expressWinstonLogger = expressWinston.logger({
	transports: [
		new winston.transports.Console({ level: 'warn' })
	],
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.simple()
	),
	msg: function (req, res) {
		if (req.user)
			return "{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms name:{{req.user.display_name}} reg_no:{{req.user.reg_no}}";
		else
			return "{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms";
	},
	colorize: true,

	meta: false,
	
	statusLevels: false, // default value
	level: function (req, res) {
		var level = "";
		if (res.statusCode >= 100) { level = "verbose"; }
		if (res.statusCode >= 400) { level = "warn"; }
		if (res.statusCode >= 500) { level = "error"; }
		// Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
		// if (res.statusCode == 401 || res.statusCode == 403) { level = "critical"; }
		return level;
	}
});