const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	// Google
	google_id: String,
	display_name: String,
	email: String,
	picture: String,


	// VTOP
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
		bridge_reqd: Number,
		bridge_earned: Number,
		total_reqd: Number,
		total_earned: Number,
		sts_distib: Number,
		sts_reqd: Number,
		sts_earned: Number,
		exc_distib: Number,
		exc_reqd: Number,
		exc_earned: Number,
		lang_distib: Number,
		lang_reqd: Number,
		lang_earned: Number,
	}

});

module.exports = mongoose.model("User", userSchema);