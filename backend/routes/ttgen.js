const express = require('express');
const sdk = require('aws-sdk');

const userUtility = require('../utility/userUtility');
const { logger } = require('../utility/loggers.js');

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));


const lambda = new sdk.Lambda({ accessKeyId: process.env.NODE_AWS_ACCESS_KEY_ID, secretAccessKey: process.env.NODE_AWS_SECRET_ACCESS_KEY, region: process.env.NODE_AWS_REGION });

const dailyCountLimit = 20;
const hourlyCountLimit = 10;

async function genTT(params) {
	const tt = await lambda.invoke(params).promise();
	return tt.Payload;
}

router.post('/generateTimetable', async (req, res) => {
	const user = await userUtility.findUserByID(req.user._id);

	if (!user.vtopSignedIn) { return res.json({ success: false, message: 'Not signed in to VTOP' }); }

	if (user.dailyCount >= dailyCountLimit) {
		return res.json({ success: false, message: 'Exceeded Daily Limit' });
	}

	if (user.hourlyCount >= hourlyCountLimit) {
		return res.json({ success: false, message: 'Exceeded Hourly Limit' });
	}

	userUtility.updateUser(
		{ _id: req.user._id },
		{ $inc: { dailyCount: 1, hourlyCount: 1, totalCount: 1 } },
	);

	const completedCourses = user.completed_courses.reduce((a, v) => {
		a[v.code] = v.grade;
		return a;
	}, {});

	// var pref = {
	// 	slot: { 'evening': 2, 'morning': 1 },
	// 	course: { 'ELA': 1, 'EPJ': 1, 'ETH': 1 },
	// 	days: { 'Monday': 1, 'Tuesday': 1, 'Wednesday': 1, 'Thursday': 1, 'Friday': -1 },
	// 	misc: { 'checkboard': 0 }
	// };
	const { pref } = req.body;
	pref.regno = user.reg_no;
	const allowed = [
		'16BCE', '16BME', '16BIT', '16BEC', '16BEM', '17BCI', '17BEC', '17BIT',
		'17BCE', '17BEM', '17BME', '17BIS', '18BCB', '18BCE', '18BCL', '18BCI',
		'18BEC', '18BIT', '18BEE', '17BMD', '17BCL', '17BEE', '16BCB', '16BCL',
		'18BME', '17BMA', '18BEM', '16BCI',
	];

	if (!allowed.includes(pref.regno.slice(0, 5))) {
		return res.json({ success: false, message: 'Coming soon for your curriculum, check back soon' });
	}

	pref.credits = parseInt(pref.credits, 10);
	// pref.regno = '17BCE0113';
	// pref.credits = Number(req.body.credits) || 24;

	pref.ue = user.credit_summary.ue_earned;
	pref.uc = user.credit_summary.uc_earned;
	pref.pe = user.credit_summary.pe_earned;
	pref.pc = user.credit_summary.pc_earned;

	const data = { pref, completedCourses };

	const params = { FunctionName: 'gentt', InvocationType: 'RequestResponse', LogType: 'Tail' };
	params.Payload = JSON.stringify(data);


	let tt = await genTT(params);
	tt = JSON.parse(tt);
	try {
		tt = tt.map((v) => {
			delete v.__v;
			delete v.count;
			delete v.percent;
			delete v.total;
			v.timetableName = `Auto_${Date.now()}`;

			return v;
		});
	} catch (e) {
		logger.error(e);
		logger.error(tt);
		return res.json({ success: false, message: 'Some error occurred,we are looking into it' });
	}
	return res.json({ success: true, data: tt });
});

module.exports = router;
