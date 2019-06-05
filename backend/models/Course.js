const mongoose = require("mongoose");

var courseSchema = mongoose.Schema({	// From the data given in the sheet
	code: String,
	title: String,
	course_type: String,
	credits: Number,
	slot: String, 
	faculty: String,
	venue: String,
	count: { type: Number, default: 0 },
	percent: { type: Number, default: 0 },
	timestamp: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Course", courseSchema);