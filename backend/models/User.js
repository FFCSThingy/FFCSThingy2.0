const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	// Google
	google_id: String,
	display_name: String,
	email: String,
	picture: String,

	// FFCS.OOO
	selected_curriculum: String,
	timestamp: { type: Date, default: Date.now() },
	hourlyCount: { type: Number, default: 0 },
	dailyCount: { type: Number, default: 0 },
	totalCount: { type: Number, default: 0 },


	// VTOP
	vtopSignedIn: { type: Boolean, default: false },
	name: String,
	reg_no: String,
	gender: String,
	programme: String,
	branch: String,
	school: String,
	campus: String,
	joined_yr: String,


	grades: {	// From Grade History Summary
		cgpa: Number,
		creds_reg: Number,
		creds_earned: Number,
		s: Number,
		a: Number,
		b: Number,
		c: Number,
		d: Number,
		e: Number,
		f: Number,
		n: Number,
	},

	credit_summary: {
		pc_reqd: Number,
		pc_earned: Number,
		uc_reqd: Number,
		uc_earned: Number,
		pe_reqd: Number,
		pe_earned: Number,
		ue_reqd: Number,
		ue_earned: Number,
		bridge_reqd: String,
		bridge_earned: String,
		total_reqd: Number,
		total_earned: Number,
		sts_distib: String,
		sts_reqd: Number,
		sts_earned: Number,
		exc_distib: String,
		exc_reqd: Number,
		exc_earned: Number,
		lang_distib: String,
		lang_reqd: Number,
		lang_earned: Number,
	},

	selected_courses: [{
		code: String,
		title: String,
		course_type: String,
		credits: String,
		slot: String,
		faculty: String,
		venue: String,
		timetableName: String,
	}],

	previous_timetables: [{
		code: String,
		title: String,
		course_type: String,
		credits: String,
		slot: String,
		faculty: String,
		venue: String,
		semester: String,
	}],

	completed_courses: [{
		code: String,
		title: String,
		course_type: String,
		credits: String,
		grade: String,
	}],

});

module.exports = mongoose.model('User', userSchema);
