import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx-to-json';

// Models
import Curriculum from '../models/Curriculum';
import User from '../models/User';
import Course from '../models/Course';

import system from './systemUtility';

// Files
const xlsxInputFile = path.join(__dirname, '..', '..', 'backend', 'data', 'report.xlsx');
const jsonOutputFile = path.join(__dirname, '..', '..', 'backend', 'data', 'report.json');

module.exports.getFullHeatmap = () => {
	return new Promise((resolve, reject) => {
		Course.find({}, function(err, doc) {
			if(err) return reject(err);
			return resolve(doc);
		});
	});
}

module.exports.getCourseList = () => {
	return new Promise((resolve, reject) => {
		Course.aggregate([
			{
				$group: {
					_id: {
						code: "$code",
						// title: "$title",
						// credits: "$credits"
					},
					title: { $addToSet: "$title" },
					lengths: { $addToSet: { $strLenCP: "$title" } }
				}
			}, {
				$project: {
					code: "$_id.code",
					title: "$title",
					maxLength: { $max: "$lengths" },
					lengths: "$lengths",
					// credits: "$_id.credits",
					_id: 0
				}
			}, {
				$project: {
					code: 1,
					title: 1,
					maxLength: 1,
					lengths: 1,
					index: { $indexOfArray: [ "$lengths", "$maxLength" ] },
				}
			}, {
				$project: {
					code: 1,
					// title: 1,
					// maxLength: 1,
					// lengths: 1,
					// index: 1,
					// longestTitle: { $arrayElemAt: [ "$title", "$index" ] },
					title: { $arrayElemAt: ["$title", "$index"] },
				}
			}, {
				$sort: {
					code: 1
				}
			}
		], function(err, doc) {
			console.log(err);
			if(err) return reject(err);
			return resolve(doc);
		})
	});
}

module.exports.getCourseDetails = (query) => {
	return new Promise((resolve,  reject) => {
		Course.findOne(query, function(err, doc) {
			if(err) return reject(err);
			return resolve(doc);
		})
	});
}

module.exports.parseXLSX = () => {
	return new Promise(async (resolve, reject) => {
		xlsx({
			input: xlsxInputFile,
			output: jsonOutputFile
		}, function (err, result) {
			if (err) {
				return reject(err);
			} else {
				return resolve(result);
			}
		});
	});
}

module.exports.addCourseToDB = (course) => {
	return new Promise((resolve, reject) => {
		// Add deletes for all unnecessary fields or add them to DB Model
		if(course.seats) delete course.seats;

		var queryData = {
			code: course.code,
			venue: course.venue,
			course_type: course.course_type,
			slot: course.slot,
			faculty: course.faculty,
			credits: course.credits
		}

		var updateData = {
			code: course.code,
			venue: course.venue,
			course_type: course.course_type,
			slot: course.slot,
			faculty: course.faculty,
			credits: course.credits,
			title: course.title,
			timestamp: Date.now()
		}

		Course.findOneAndUpdate(queryData, updateData, 
			{ upsert: true, new: true, setDefaultsOnInsert: true }, 
			function(err, doc) {
				if(err) return reject(err);
				return resolve(doc._id);
			});
	});
}

module.exports.cleanCoursesAfterRepopulate = (time) => {
	return new Promise((resolve, reject) => {
		Course.deleteMany({ timestamp: { $lt: time } }, function(err, details, docs) {
			if(err) return reject(err);
			return resolve(details);
		});
	});
}