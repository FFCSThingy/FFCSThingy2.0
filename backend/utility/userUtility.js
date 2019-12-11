const cron = require('node-cron');
const { logger } = require('./loggers.js');

// Models
const User = require('../models/User');

module.exports.findUserByID = (id) => User.findById(id).exec();

module.exports.updateUser = (query, update, upsert = false, newVal = true, setDefaultsVal = true) => {
	update.timestamp = Date.now();
	return User.findOneAndUpdate(query, update,
		{ upsert, new: newVal, setDefaultsOnInsert: setDefaultsVal }).exec();
};

module.exports.aggregateSpecificCourseCount = (course) => User.aggregate([
	{ $unwind: '$selected_courses' },
	{
		$match: {
			'selected_courses.code': course.code,
			'selected_courses.course_type': course.course_type,
			'selected_courses.faculty': course.faculty,
			'selected_courses.venue': course.venue,
			'selected_courses.slot': course.slot,
		},
	},
	{
		$group: {
			_id: {
				code: '$selected_courses.code',
				course_type: '$selected_courses.course_type',
				faculty: '$selected_courses.faculty',
				venue: '$selected_courses.venue',
				slot: '$selected_courses.slot',
			},
			count: { $sum: 1 },
		},
	},
]).exec();

module.exports.aggregateCourseCount = (course) => User.aggregate([
	{ $unwind: '$selected_courses' },
	{
		$match: {
			code: course.code,
			course_type: course.course_type,
		},
	},
	{
		$group: {
			_id: {
				code: '$selected_courses.code',
				course_type: '$selected_courses.course_type',
			},
			count: { $sum: 1 },
		},
	},
]).exec();

module.exports.aggregateSlotCounts = () => User.aggregate([
	{ $unwind: '$selected_courses' },
	{
		$group: {
			_id: {
				code: '$selected_courses.code',
				course_type: '$selected_courses.course_type',
				slot: '$selected_courses.slot',
				faculty: '$selected_courses.faculty',
			},
			count: { $sum: 1 },
		},
	},
	{
		$sort: {
			'_id.code': 1,
			'_id.course_type': 1,
			'_id.slot': 1,
			'_id.faculty': 1,
		},
	}, {
		$project: {
			code: '$_id.code',
			course_type: '$_id.course_type',
			slot: '$_id.slot',
			faculty: '$_id.faculty',
			count: 1,
			_id: 0,
		},
	},
]).exec();

module.exports.aggregateCounts = () => User.aggregate([
	{ $unwind: '$selected_courses' },
	{
		$group: {
			_id: {
				code: '$selected_courses.code',
				course_type: '$selected_courses.course_type',
			},
			count: { $sum: 1 },
		},
	},
	{
		$sort: {
			'_id.code': 1,
			'_id.course_type': 1,
		},
	},
]).exec();

cron.schedule('0 */1 * * *', () => {
	// if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
	if (process.env.NODE_ENV !== 'staging') {
		logger.info(`Resetting Hourly Counts ${new Date().toLocaleString()}`);
		module.exports.updateUser({ hourlyCount: { $gt: 0 } }, { hourlyCount: 0 });
	}
});

cron.schedule('0 0 */1 * *', () => {
	// if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
	if (process.env.NODE_ENV !== 'staging') {
		logger.info(`Resetting Daily Counts ${new Date().toLocaleString()}`);
		module.exports.updateUser({ dailyCount: { $gt: 0 } }, { dailyCount: 0 });
	}
});
