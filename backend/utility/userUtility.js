const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Scrapers
const grades = require('../scrapers/userhistory');
const curriculum = require('../scrapers/curriculum');

// Models
const Curriculum = require('../models/Curriculum');
const User = require('../models/User');


module.exports.findUserByID = function findUserByID(id) {
	return new Promise((resolve, reject) => {
		User.findById(id, function(err, doc) {
			if(err) return reject(err);
			return resolve(doc);
		})
	});
}

module.exports.updateUser = (query, update, 
	upsert=false, newVal=true, setDefaultsVal=true) => {
		
	return new Promise((resolve, reject) => {
		update.timestamp = Date.now();
		User.findOneAndUpdate(query, update, 
			{ upsert: upsert, new: newVal, setDefaultsOnInsert: setDefaultsVal},
			function (err, doc) {
				if(err) return reject(err);
				return resolve(doc);
			});
	});
}

cron.schedule('0 */1 * * *', function () {
	// if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
	if (process.env.NODE_ENV !== 'staging') {
		console.log("Resetting Hourly Counts");
		module.exports.updateUser({ hourlyCount: { $gt: 0 } }, { hourlyCount: 0 });
	}
});

cron.schedule('0 0 */1 * *', function () {
	// if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
	if (process.env.NODE_ENV !== 'staging') {
		console.log("Resetting Daily Counts");
		module.exports.updateUser({ dailyCount: { $gt: 0 } }, { dailyCount: 0 });
	}
});



module.exports.aggregateSpecificCourseCount = (course) => {
	return new Promise((resolve, reject) => {
		User.aggregate([
			{ $unwind: '$selected_courses' },
			{ 
				$match: {
					'selected_courses.code': course.code,
					'selected_courses.course_type': course.course_type,
					'selected_courses.faculty': course.faculty,
					'selected_courses.venue': course.venue,
					'selected_courses.slot': course.slot
				} 
			},
			{
				$group: {
					_id: {
						code: '$selected_courses.code',
						course_type: '$selected_courses.course_type',
						faculty: '$selected_courses.faculty',
						venue: '$selected_courses.venue',
						slot: '$selected_courses.slot'
					},
					count: { $sum: 1 }
				}
			}
		], function(err, doc) {
			// console.log()
			if (err) return reject(err);
			// console.log("SpecificAggDoc: " + JSON.stringify(doc))
			return resolve(doc);
		});
	});
}

module.exports.aggregateCourseCount = (course) => {
	return new Promise((resolve, reject) => {
		User.aggregate([
			{ $unwind: '$selected_courses' },
			{
				$match: {
					code: course.code,
					course_type: course.course_type,
				}
			},
			{
				$group: {
					_id: {
						code: '$selected_courses.code',
						course_type: '$selected_courses.course_type',
					},
					count: { $sum: 1 }
				}
			}
		], function (err, doc) {
			if (err) return reject(err);
			return resolve(doc);
		});
	});
}

module.exports.aggregateSlotCounts = () => {
	return new Promise((resolve, reject) => {
		User.aggregate([
			{ $unwind: '$selected_courses' },
			{
				$group: {
					_id: {
						code: '$selected_courses.code',
						course_type: '$selected_courses.course_type',
						slot: '$selected_courses.slot',
						faculty: '$selected_courses.faculty',
					},
					count: { $sum: 1 }
				}
			},
			{
				$sort: {
					'_id.code': 1,
					'_id.course_type': 1,
					'_id.slot': 1,
					'_id.faculty': 1,
				}
			}, {
				$project: {
					code: '$_id.code',
					course_type: '$_id.course_type',
					slot: '$_id.slot',
					faculty: '$_id.faculty',
					count: 1,
					_id: 0
				}
			}
		], function (err, doc) {
			if (err) return reject(err);
			return resolve(doc);
		});
	});
}

module.exports.aggregateCounts = () => {
	return new Promise((resolve, reject) => {
		User.aggregate([
			{ $unwind: '$selected_courses' },
			{
				$group: {
					_id: {
						code: '$selected_courses.code',
						course_type: '$selected_courses.course_type',
					},
					count: { $sum: 1 }
				}
			}, 
			{
				$sort: {
					'_id.code': 1,
					'_id.course_type': 1,
				}
			}
		], function (err, doc) {
			if (err) return reject(err);
			return resolve(doc);
		});
	});
}