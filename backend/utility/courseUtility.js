const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx-to-json');
const cron = require('node-cron');

// Models
const Curriculum = require('../models/Curriculum');
const User = require('../models/User');
const Course = require('../models/Course');

const systemUtility = require('./systemUtility');
const userUtility = require('./userUtility');

// Files
const xlsxInputFile = path.join(__dirname, '..', '..', 'backend', 'data', 'report.xlsx');
const jsonOutputFile = path.join(__dirname, '..', '..', 'backend', 'data', 'report.json');

module.exports.getFullHeatmap = () => {
	return new Promise((resolve, reject) => {
		Course.find({}, function (err, doc) {
			if (err) return reject(err);
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
						credits: "$credits",
						course_type: "$course_type"
					},
					title: { $addToSet: "$title" },
					lengths: { $addToSet: { $strLenCP: "$title" } }
				}
			}, {
				$group: {
					_id: {
						code: "$_id.code",
						title: "$title",
						lengths: "$lengths"
					},
					credits: { $sum: "$_id.credits" },
					types: { $addToSet: "$_id.course_type" },
				}
			}, {
				$project: {
					code: "$_id.code",
					credits: { $sum: "$credits" },
					types: 1,
					titles: "$_id.title",
					title: { $arrayElemAt: ["$_id.title", { $indexOfArray: ["$_id.lengths", { $max: "$_id.lengths" }] }] },
					_id: 0
				}
			}, {
				$group: {
					_id: {
						code: "$code"
					},
					titles: { $addToSet: "$title" },
					lengths: { $addToSet: { $strLenCP: "$title" } },
					credits: { $sum: "$credits" },
				}
			}, {
				$project: {
					code: "$_id.code",
					credits: { $sum: "$credits" },
					title: { $arrayElemAt: ["$titles", { $indexOfArray: ["$lengths", { $max: "$lengths" }] }] },
					_id: 0
				}
			}, {
				$sort: {
					code: 1
				}
			}
		], function (err, doc) {
			console.log(err);
			if (err) return reject(err);
			return resolve(doc);
		})
	});
}

module.exports.getCourseDetails = (query) => {
	return new Promise((resolve, reject) => {
		Course.findOne(query, function (err, doc) {
			if (err) return reject(err);
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
		if (course.seats) delete course.seats;

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
			function (err, doc) {
				if (err) return reject(err);
				return resolve(doc._id);
			});
	});
}

module.exports.cleanCoursesAfterRepopulate = (time) => {
	return new Promise((resolve, reject) => {
		Course.deleteMany({ timestamp: { $lt: time } }, function (err, details, docs) {
			if (err) return reject(err);
			return resolve(details);
		});
	});
}

function updateCourse(query, update) {
	return new Promise((resolve, reject) => {
		Course.findOneAndUpdate(query, update, { new: true }, function (err, doc) {
			if (err) return reject(err);
			return resolve(doc);
		})
	});
}

async function doHeatmapUpdate(doc, counts) {
	return await Promise.all(doc.map(async c => {
		var total = counts.find((e) => e._id.code === c.code && e._id.course_type === c.course_type);
		
		if (total) {
			var countData = (await userUtility.aggregateSpecificCourseCount(c))[0];
			if(countData) {
				c.count = countData.count;
				c.percent = await c.count / total.count * 100;
				c.timestamp = new Date();
			}
			c.total = total.count;
		}
		else {
			return Promise.resolve(c);
		}
		// console.log(total);

		var query = {
			code: c.code,
			venue: c.venue,
			slot: c.slot,
			faculty: c.faculty,
			course_type: c.course_type
		}

		return await updateCourse(query, c);
	}))
}

module.exports.updateHeatmap = () => {
	return new Promise((resolve, reject) => {
		Course.find({}, async function (err, doc) {
			try {
				console.log('Heatmap update started at: ' + new Date());

				var initTime = Date.now();
				var counts = await userUtility.aggregateCounts();
				// console.log(counts);
				var updates = await doHeatmapUpdate(doc, counts);
				// console.log(updates);
				var timestamp = await systemUtility.updateHeatmapUpdateTime();

				console.log('Heatmap update processed at: ' + timestamp + ' in ' + (timestamp.getTime() - initTime) + 'ms');
				return resolve({timestamp: timestamp, docs: updates});
			} catch (err) {
				console.log(err);
				return reject(err);
			}
		});
	});
}

cron.schedule('* * * * *', () => {
	console.log('Running Heatmap Update');
	module.exports.updateHeatmap();
});