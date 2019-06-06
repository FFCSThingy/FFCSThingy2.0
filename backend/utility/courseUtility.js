import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx-to-json';

// Models
import Curriculum from '../models/Curriculum';
import User from '../models/User';
import Course from '../models/Course';

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
						title: "$title"
					}
				}
			}, {
				$project: {
					code: "$_id.code",
					title: "$_id.title",
					_id: 0
				}
			},{
				$sort: {
					code: 1
				}
			}
		], function(err, doc) {
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