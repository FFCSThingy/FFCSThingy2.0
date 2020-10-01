const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
	code: String,
	title: String,
	courseType: String,
	simpleCourseType: String,
	shortCourseType: String,
	credits: Number,
	slot: String,
	faculty: String,
	venue: String,
	count: { type: Number, default: 0 },
	total: { type: Number, default: 0 },
	percent: { type: Number, default: 0 },
	timestamp: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Course', courseSchema);
