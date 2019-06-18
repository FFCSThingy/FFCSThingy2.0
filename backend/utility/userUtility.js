import fs from 'fs';
import path from 'path';

// Scrapers
import grades from '../scrapers/userhistory';
import curriculum from '../scrapers/curriculum';

// Models
import Curriculum from '../models/Curriculum';
import User from '../models/User';


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