const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx-to-json');
const cron = require('node-cron');
const ObjectId = require('mongoose').Types.ObjectId;

// Models
const Curriculum = require('../models/Curriculum');
const User = require('../models/User');
const Course = require('../models/Course');

const systemUtility = require('./systemUtility');
const userUtility = require('./userUtility');

// Files
const xlsxInputFile = path.join(__dirname, '..', '..', 'backend', 'data', 'report.xlsx');
const jsonOutputFile = path.join(__dirname, '..', '..', 'backend', 'data', 'report.json');

var heatmap, courseList;

module.exports.getFullHeatmap = (regardless=false) => {
	return new Promise((resolve, reject) => {
		if(!heatmap || regardless) {
			Course.aggregate([
				{
					$sort: {
						percent: -1,
						code: 1,
						slot: 1,
						faculty: 1, 
						venue: 1,
						course_type: 1,
					}
				}
			], function (err, doc) {
				if (err) return reject(err);
				return resolve(doc);
			});
		} else return resolve(heatmap);
	});
}

module.exports.getCourseList = (regardless=false) => {
	return new Promise((resolve, reject) => {
		if(courseList && !regardless) return resolve(courseList);

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
					types: { $addToSet: "$types" }
				}
			}, {
				$project: {
					code: "$_id.code",
					credits: { $sum: "$credits" },
					title: { $arrayElemAt: ["$titles", { $indexOfArray: ["$lengths", { $max: "$lengths" }] }] },
					types: { $arrayElemAt: ["$types", 0] },
					_id: 0
				}
			}, {
				$sort: {
					code: 1
				}
			}
		], function (err, doc) {
			if (err) return reject(err);
			return resolve(doc);
		})
	});
}

module.exports.getCourseFacultyList = (regardless = false) => { 
	return new Promise((resolve, reject) => {
		Course.aggregate([
			{
				$group: {
					_id: {
						faculty: "$faculty",
					},
					courseList: { $addToSet: "$code" }
				}
			}, {
				$sort: {
					"_id.faculty": 1
					}
			}, {
				$group: {
					_id: null,
					array: {
						$push: {
							k: "$_id.faculty",
							v: "$courseList"
						}
					}
				}
			}, {
				$project: {
					_id: 0,
					list: { $arrayToObject: "$array" }
				}
			}
		], function (err, doc) {
			if (err) return reject(err);
			return resolve(doc);
		})
	});
}

cron.schedule('*/5 * * * *', function () {
	if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
	// if (process.env.NODE_ENV !== 'staging') {
		console.log("Updating cached heatmap");
		module.exports.getFullHeatmap(true).then(function (dat) {
			heatmap = dat;
		});

		console.log("Updating cached courseList");
		module.exports.getCourseList(true).then(function (dat) {
			courseList = dat;
		});
	}
});

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
		
		// var two = ['EEE3999', 'CHE3999', 'CLE3999', 'CSE3999', 'ITE3999', 'SWE3999', 'MEE3999', 'ARC1013', 'ARC4008', 'BMG6007', 'MEE218', 'MEE305', 'ARC4008'];
		// var twelve = ['ITA3099', 'MMA3099'];
		// var fourteen = ['BST6099', 'ITA6099'];
		// var sixteen = ['BIT6099', 'EEE6099', 'ITE6099', 'MEE6099'];
		// var twenty = ['BIY599', 'CHE4099', 'CSE4099', 'CSE499', 'EEE4099', 'EEE499', 'EIE499', 'ECE4099', 'ITE4099', 'ITE499', 'MEE4099'];
		// var twentyfour = ['SWE3004', 'SWE599'];

		// var twoCreds = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2", "F1", "F2", "G1", "G2"];
		// var oneCreds = ["TA1", "TA2", "TAA1", "TAA2", "TB1", "TB2", "TBB2", "TC1", "TC2", "TCC1", "TCC2", "TD1", "TD2", "TDD2", "TE1", "TE2", "TF1", "TF2", "TG1", "TG2"];

		// if (two.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE))
		// 	course.CREDITS = 2;
		// else if (twelve.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE))
		// 	course.CREDITS = 12;
		// else if (fourteen.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE))
		// 	course.CREDITS = 14;
		// else if (sixteen.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE))
		// 	course.CREDITS = 16;
		// else if (twenty.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE))
		// 	course.CREDITS = 20;
		// else if (twentyfour.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE))
		// 	course.CREDITS = 24;
		// else if(course.TYPE === 'SS') 
		// 	course.CREDITS = 1;
		// else if (['TH', 'ETH'].includes(course.TYPE)) {
		// 	var slots = course.SLOT.replace(' ', '').split('+');
		// 	course.CREDITS = slots.reduce((a,v) => {
		// 		if(oneCreds.includes(v)) return a + 1;
		// 		if(twoCreds.includes(v)) return a + 2;
		// 		return a;
		// 	}, 0)
		// }
		// else if (['LO', 'ELA'].includes(course.TYPE))	
		// 	course.CREDITS = course.SLOT.replace(' ', '').split('+').length / 2;
		// else if(course.TYPE === 'EPJ') 
		// 	course.CREDITS = 1;	


		var queryData = {
			code: course.code,
			venue: course.venue,
			course_type: course.course_type,
			slot: course.slot.replace(' ', ''),
			faculty: course.faculty,
			credits: course.credits || 0
		}

		var updateData = {
			code: course.code,
			venue: course.venue,
			course_type: course.course_type,
			slot: course.slot.replace(' ', ''),
			faculty: course.faculty,
			credits: course.credits || 0,
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

module.exports.doCleanRemovedCourses = () => {
	return new Promise(async (resolve, reject) => {
		try {
			var current = await getCurrentCourseIDs();
			current = current.map(v => v._id.toString());

			var selected = await getSelectedCourseIDs();
			selected = selected.map(v => v._id.toString());

			var deletes = selected.filter(value => !current.includes(value));

			var details = {
				currentCourses: current.length,
				selectedCourses: selected.length,
				deletes: deletes.length
			}

			console.log(details);
			
			var cleanDetails = await removeOldCoursesBulk(deletes);
			return resolve(cleanDetails);
		} catch(err) {
			console.log("Error in doCleanRemovedCourses()");
			return reject(err)
		}
	});
}

function removeOldCoursesBulk(deletes) {
	return new Promise((resolve, reject) => {
		User.updateMany(
			{
				selected_courses: {
					$elemMatch: {
						_id: {
							$in: deletes
						}
					}
				}
			},
			{
				$pull: {
					selected_courses: {
						_id: {
							$in: deletes
						}
					}
				}
			},
			function (err, doc) {
				if (err) return reject(err);
				console.log(doc);
				return resolve(doc);
			}
		);
	});
}

function removeOldCourses(deleteID) {
	return new Promise((resolve, reject) => {
		User.updateMany( 
			{
				selected_courses: {
					$elemMatch: {
						_id: deleteID
					}
				}
			},
			{
				$pull: {
					selected_courses: {
						_id: deleteID
					}	
				}
			}, 
			function(err, doc) {
				if(err) return reject(err);
				console.log(doc);
				return resolve(doc);
			}
		);
	});
}

function getCurrentCourseIDs() {
	return new Promise((resolve, reject) => {
		Course.aggregate([
			{
				$project: {
					_id: 1
				}
			}
		], function(err, doc) {
			if (err) return reject(err);
			return resolve(doc);
		})
	});
}

function getSelectedCourseIDs() {
	return new Promise((resolve, reject) => {
		User.aggregate([
			{ $unwind: '$selected_courses' }, 
			{
				$group: {
					_id: "$selected_courses._id"
				}
			}
		], function (err, doc) {
			if (err) return reject(err);
			return resolve(doc);
		})
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

async function doHeatmapUpdate(counts, specificSlot) {
	return new Promise(async (resolve, reject) => {
		var total = counts.find((e) => e._id.code === specificSlot.code && e._id.course_type === specificSlot.course_type);
		var query = {
			code: specificSlot.code,
			slot: specificSlot.slot,
			faculty: specificSlot.faculty,
			course_type: specificSlot.course_type
		}

		var update = {
			count: 0,
			total: 0,
			percent: 0,
			timestamp: Date.now()
		}

		if(total) {
			update.count = specificSlot.count;
			update.total = total.count;
			update.percent = specificSlot.count / total.count * 100;
			update.timestamp = Date.now();
		}

		try {
			var updateStatus = await updateCourse(query, update);
			return resolve(updateStatus);
		} catch(err) {
			return reject(err);
		}
	});
}

module.exports.updateHeatmap = () => {
	return new Promise(async (resolve, reject) => {
		try {
			var initTime = new Date();
			console.log('Heatmap update started at: ' + initTime);

			var counts = await userUtility.aggregateCounts();
			var specificCounts = await userUtility.aggregateSlotCounts();

			var updates = await Promise.all(specificCounts.map(slot => doHeatmapUpdate(counts, slot)));

			var timestamp = await systemUtility.updateHeatmapUpdateTime();
			console.log('Heatmap update processed at: ' + timestamp + ' in ' + (timestamp.getTime() - initTime) + 'ms');

			return resolve({ timestamp: timestamp, docs: updates });
		} catch (err) {
			console.log('Error in updateHeatmap: ' + err);
			return reject(err);
		}
	});
}

cron.schedule('*/10 * * * *', () => {
	if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'development') {
		console.log('Running Heatmap Update');
		module.exports.updateHeatmap();
	}
});