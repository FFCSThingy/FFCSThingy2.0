const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const sdk = require('aws-sdk');

const user = require('../utility/userUtility');

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));


const lambda = new sdk.Lambda({ accessKeyId: process.env.NODE_AWS_ACCESS_KEY_ID, secretAccessKey: process.env.NODE_AWS_SECRET_ACCESS_KEY, region: process.env.NODE_AWS_REGION, });

const dailyCountLimit = 20;
const hourlyCountLimit = 10;

router.get('/generateTimetable', async (req, res, next) => {
	var user = await user.findUserByID(req.user._id);

	if (!user.vtopSignedIn) 
		return res.json({ success: false, message: 'Not signed in to VTOP' });
	
	if (user.dailyCount >= dailyCountLimit) 
		return res.json({success: false, message: 'Exceeded Daily Limit'});

	if (user.hourlyCount >= hourlyCountLimit) 
		return res.json({success: false, message: 'Exceeded Hourly Limit'});

	user.updateUser({ _id: req.user._id }, { $inc: { dailyCount: 1, hourlyCount: 1, totalCount: 1 } });

	var completed_courses = user.completed_courses.reduce((a,v) => {
		a[v.code] = v.grade;
		return a;
	}, {});

	// var pref = {
	// 	slot: { 'evening': 2, 'morning': 1 }, 
	// 	course: { 'ELA': 1, 'EPJ': 1, 'ETH': 1 },
	// 	days: { 'Monday': 1, 'Tuesday': 1, 'Wednesday': 1, 'Thursday': 1, 'Friday': -1 }, 
	// 	misc: { 'checkboard': 0 }
	// };
	var pref = req.body.pref;
	pref.regno = user.reg_no;
	// pref.regno = '17BCE0113';
	// pref.credits = Number(req.body.credits) || 24;

	pref.ue = user.credit_summary.ue_earned;
	pref.uc = user.credit_summary.uc_earned;
	pref.pe = user.credit_summary.pe_earned;
	pref.pc = user.credit_summary.pc_earned;

	var data = { pref: pref, completed_courses: completed_courses };

	var params = { FunctionName: 'gentt', InvocationType: 'RequestResponse', LogType: 'Tail' };
	params.Payload = JSON.stringify(data);

	var tt = await genTT(params);
	tt = JSON.parse(tt);
	tt = tt.map(v => {
		delete v.__v;
		delete v.count;
		delete v.percent;
		delete v.total;
		v.timetableName = 'Auto_' + Date.now();

		return v;
	})
	res.json({ success: true, data: tt });
});

async function genTT(params) {
	const tt = await lambda.invoke(params).promise();
	return tt.Payload;
}

module.exports = router;