const mongoose = require('mongoose');
const consts = require('../utility/constants');

const userSchema = new mongoose.Schema({
	// Google
	googleId: String,
	displayName: String,
	email: String,
	picture: String,

	// FFCS.OOO
	selectedCurriculum: String,
	timestamp: { type: Date, default: Date.now() },
	hourlyCount: { type: Number, default: 0 },
	dailyCount: { type: Number, default: 0 },
	totalCount: { type: Number, default: 0 },
	scopes: {
		type: [String],
		default: [consts.userScopes.user],
	},


	// VTOP
	vtopSignedIn: { type: Boolean, default: false },
	name: String,
	regNo: String,
	gender: String,
	programme: String,
	branch: String,
	school: String,
	campus: String,
	joinedYr: String,


	grades: {	// From Grade History Summary
		cgpa: Number,
		credsReg: Number,
		credsEarned: Number,
		s: Number,
		a: Number,
		b: Number,
		c: Number,
		d: Number,
		e: Number,
		f: Number,
		n: Number,
	},

	creditSummary: {
		pcReqd: Number,
		pcEarned: Number,
		uc_reqd: Number,
		ucReqd: Number,
		ucEarned: Number,
		peReqd: Number,
		peEarned: Number,
		ueReqd: Number,
		ueEarned: Number,
		bridgeReqd: String,
		bridgeEarned: String,
		totalReqd: Number,
		totalEarned: Number,
		stsDistib: String,
		stsReqd: Number,
		stsEarned: Number,
		excDistib: String,
		excReqd: Number,
		excEarned: Number,
		langDistib: String,
		langReqd: Number,
		langEarned: Number,
	},

	selectedCourses: [{
		code: String,
		title: String,
		courseType: String,
		credits: Number,
		slot: String,
		faculty: String,
		venue: String,
		timetableName: String,
	}],

	previousTimetables: [{
		code: String,
		title: String,
		courseType: String,
		credits: String,
		slot: String,
		faculty: String,
		venue: String,
		semester: String,
	}],

	completedCourses: [{
		code: String,
		title: String,
		courseType: String,
		credits: String,
		grade: String,
	}],

});

module.exports = mongoose.model('User', userSchema);
