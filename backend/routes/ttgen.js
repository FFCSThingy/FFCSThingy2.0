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

router.get('/generateTimetable/:credits?', async (req, res, next) => {
	if(!req.user.vtopSignedIn) return res.json({success: false, message: 'Not signed in to VTOP'});

	var completed_courses = req.user.completed_courses.reduce((a,v) => {
		a[v.code] = v.grade;
		return a;
	}, {});

	var pref = {
		slot: { 'evening': 2, 'morning': 1 }, 
		course: { 'ELA': 1, 'EPJ': 1, 'ETH': 1 },
		days: { 'Monday': 1, 'Tuesday': 1, 'Wednesday': 1, 'Thursday': 1, 'Friday': -1 }, 
		misc: { 'checkboard': 0 }
	};
	// pref.regno = req.user.regno;
	pref.regno = '17BCE0113';
	pref.credits = Number(req.params.credits) || 24;

	pref.ue = req.user.credit_summary.ue_earned;
	pref.uc = req.user.credit_summary.uc_earned;
	pref.pe = req.user.credit_summary.pe_earned;
	pref.pc = req.user.credit_summary.pc_earned;

	var data = { pref: pref, completed_courses: completed_courses };

	var params = { FunctionName: 'gentt', InvocationType: 'RequestResponse', LogType: 'Tail' };
	params.Payload = JSON.stringify(data);

	var tt = await genTT(params);
	tt = JSON.parse(tt);
	res.json(tt);
});

async function genTT(params) {
	const tt = await lambda.invoke(params).promise();
	return tt.Payload;
}

module.exports = router;