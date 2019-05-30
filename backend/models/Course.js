const mongoose = require("mongoose");

var courseSchema = mongoose.Schema({	// From the data given in the sheet
	code: String,
	title: String,
	course_type: String,
	credits: String,
	slot: String, 
	faculty: String,
	venue: String,
	count: Number,
	course_count: Number,
	slot_count: Number,
	faculty_count: Number,
	specific_percent: Number,
	slot_percent: Number,
	faculty_percent: Number
});

module.exports = mongoose.model("Course", courseSchema);