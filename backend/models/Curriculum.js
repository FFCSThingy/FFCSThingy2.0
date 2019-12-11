const mongoose = require('mongoose');

const curriculumSchema = mongoose.Schema({	// From My Curriculum
	branch: String,
	programme: String,
	year: String,
	reg_prefix: String,
	uc: [{
		code: String,
		title: String,
		course_type: String,
		l: Number,
		t: Number,
		p: Number,
		j: Number,
		c: Number,
	}],

	pc: [{
		code: String,
		title: String,
		course_type: String,
		l: Number,
		t: Number,
		p: Number,
		j: Number,
		c: Number,
	}],

	ue: [{
		code: String,
		title: String,
		course_type: String,
		l: Number,
		t: Number,
		p: Number,
		j: Number,
		c: Number,
	}],

	pe: [{
		code: String,
		title: String,
		course_type: String,
		l: Number,
		t: Number,
		p: Number,
		j: Number,
		c: Number,
	}],

	bridge: [{
		code: String,
		title: String,
		course_type: String,
		l: Number,
		t: Number,
		p: Number,
		j: Number,
		c: Number,
	}],

	todo_creds: {
		pc: Number,
		pe: Number,
		ue: Number,
		uc: Number,
	},
});

module.exports = mongoose.model('Curriculum', curriculumSchema);
