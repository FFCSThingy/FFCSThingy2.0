const path = require('path');
const xlsx = require('xlsx-to-json');
const cron = require('node-cron');
const { logger } = require('./loggers.js');

// Models
const User = require('../models/User');
const Course = require('../models/Course');

const systemUtility = require('./systemUtility');
const userUtility = require('./userUtility');

// Files
const xlsxInputFile = path.join(__dirname, '..', 'data', 'report.xlsx');
const jsonOutputFile = path.join(__dirname, '..', 'data', 'report.json');

// Constants
const labTypes = ['LO', 'ELA'];
const projectTypes = ['PJT', 'EPJ'];
const theoryTypes = ['TH', 'ETH', 'SS'];

// Cache Variables
let heatmap;
let courseList;
let courseFacultyList;
let courseSlotList;
let courseTypeList;
let newCourseList;

this.removeOldCoursesBulk = (deletes) => User.updateMany(
	{
		selected_courses: {
			$elemMatch: {
				_id: {
					$in: deletes,
				},
			},
		},
	},
	{
		$pull: {
			selected_courses: {
				_id: {
					$in: deletes,
				},
			},
		},
	},
).exec();

this.getCurrentCourseIDs = () => Course.aggregate([
	{
		$project: {
			_id: 1,
		},
	},
]).exec();

this.getSelectedCourseIDs = () => User.aggregate([
	{ $unwind: '$selected_courses' },
	{
		$group: {
			_id: '$selected_courses._id',
		},
	},
]).exec();


this.fullHeatmapQuery = () => Course.aggregate([
	{
		$sort: {
			percent: -1,
			code: 1,
			slot: 1,
			faculty: 1,
			venue: 1,
			course_type: 1,
			simpleCourseType: 1,
		},
	},
]).exec();

this.courseListQuery = () => Course.aggregate([
	{
		$group: {
			_id: {
				code: '$code',
				credits: '$credits',
				course_type: '$course_type',
				simpleCourseType: '$simpleCourseType',
				shortCourseType: '$shortCourseType',
			},
			title: { $addToSet: '$title' },
			lengths: { $addToSet: { $strLenCP: '$title' } },
		},
	}, {
		$group: {
			_id: {
				code: '$_id.code',
				title: '$title',
				lengths: '$lengths',
			},
			credits: { $sum: '$_id.credits' },
			types: { $addToSet: '$_id.course_type' },
			simpleCourseTypes: { $addToSet: '$_id.simpleCourseType' },
			shortCourseTypes: { $addToSet: '$_id.shortCourseType' },
		},
	}, {
		$project: {
			code: '$_id.code',
			credits: { $sum: '$credits' },
			types: 1,
			simpleCourseTypes: '$simpleCourseTypes',
			shortCourseTypes: '$shortCourseTypes',
			titles: '$_id.title',
			title: { $arrayElemAt: ['$_id.title', { $indexOfArray: ['$_id.lengths', { $max: '$_id.lengths' }] }] },
			_id: 0,
		},
	}, {
		$group: {
			_id: {
				code: '$code',
			},
			titles: { $addToSet: '$title' },
			lengths: { $addToSet: { $strLenCP: '$title' } },
			credits: { $sum: '$credits' },
			types: { $addToSet: '$types' },
			simpleCourseTypes: { $addToSet: '$simpleCourseTypes' },
			shortCourseTypes: { $addToSet: '$shortCourseTypes' },
		},
	}, {
		$project: {
			code: '$_id.code',
			credits: { $sum: '$credits' },
			title: { $arrayElemAt: ['$titles', { $indexOfArray: ['$lengths', { $max: '$lengths' }] }] },
			types: { $arrayElemAt: ['$types', 0] },
			simpleCourseTypes: { $arrayElemAt: ['$simpleCourseTypes', 0] },
			shortCourseTypes: { $arrayElemAt: ['$shortCourseTypes', 0] },
			_id: 0,
		},
	}, {
		$sort: {
			code: 1,
		},
	},
]).exec();

this.newCourseListQuery = () => Course.aggregate([
	{
		$group: {
			_id: {
				code: '$code',
				credits: '$credits',
				course_type: '$course_type',
				simpleCourseType: '$simpleCourseType',
				shortCourseType: '$shortCourseType',
			},
			title: { $addToSet: '$title' },
			lengths: { $addToSet: { $strLenCP: '$title' } },
		},
	}, {
		$group: {
			_id: {
				code: '$_id.code',
				title: '$title',
				lengths: '$lengths',
			},
			credits: { $sum: '$_id.credits' },
			types: { $addToSet: '$_id.course_type' },
			simpleCourseTypes: { $addToSet: '$_id.simpleCourseType' },
			shortCourseTypes: { $addToSet: '$_id.shortCourseType' },
		},
	}, {
		$project: {
			code: '$_id.code',
			credits: { $sum: '$credits' },
			types: 1,
			simpleCourseTypes: '$simpleCourseTypes',
			shortCourseTypes: '$shortCourseTypes',
			titles: '$_id.title',
			title: { $arrayElemAt: ['$_id.title', { $indexOfArray: ['$_id.lengths', { $max: '$_id.lengths' }] }] },
			_id: 0,
		},
	}, {
		$group: {
			_id: {
				code: '$code',
			},
			titles: { $addToSet: '$title' },
			lengths: { $addToSet: { $strLenCP: '$title' } },
			credits: { $sum: '$credits' },
			types: { $addToSet: '$types' },
			simpleCourseTypes: { $addToSet: '$simpleCourseTypes' },
			shortCourseTypes: { $addToSet: '$shortCourseTypes' },
		},
	}, {
		$project: {
			code: '$_id.code',
			credits: { $sum: '$credits' },
			title: { $arrayElemAt: ['$titles', { $indexOfArray: ['$lengths', { $max: '$lengths' }] }] },
			types: { $arrayElemAt: ['$types', 0] },
			simpleCourseTypes: { $arrayElemAt: ['$simpleCourseTypes', 0] },
			shortCourseTypes: { $arrayElemAt: ['$shortCourseTypes', 0] },
			_id: 0,
		},
	}, {
		$sort: {
			code: 1,
		},
	}, {
		$group: {
			_id: null,
			array: {
				$push: {
					k: '$code',
					v: {
						credits: '$credits',
						title: '$title',
						types: '$types',
						simpleCourseTypes: '$simpleCourseTypes',
						shortCourseTypes: '$shortCourseTypes',
					},
				},
			},
		},
	}, {
		$project: {
			_id: 0,
			courseList: { $arrayToObject: '$array' },
		},
	},
]).exec();

this.courseFacultyListQuery = () => Course.aggregate([
	{
		$group: {
			_id: {
				faculty: '$faculty',
			},
			courseList: { $addToSet: '$code' },
		},
	}, {
		$sort: {
			'_id.faculty': 1,
		},
	}, {
		$group: {
			_id: null,
			array: {
				$push: {
					k: '$_id.faculty',
					v: '$courseList',
				},
			},
		},
	}, {
		$project: {
			_id: 0,
			list: { $arrayToObject: '$array' },
		},
	},
]).exec();

this.courseSlotListQuery = () => Course.aggregate([
	{
		$group: {
			_id: {
				slot: '$slot',
			},
			courseList: { $addToSet: '$code' },
		},
	}, {
		$sort: {
			'_id.slot': 1,
		},
	}, {
		$group: {
			_id: null,
			array: {
				$push: {
					k: '$_id.slot',
					v: '$courseList',
				},
			},
		},
	}, {
		$project: {
			_id: 0,
			courseSlotList: { $arrayToObject: '$array' },
		},
	},
]).exec();

this.courseTypeListQuery = () => Course.aggregate([
	{
		$group: {
			_id: {
				simpleCourseType: '$simpleCourseType',
			},
			courseList: { $addToSet: '$code' },
		},
	}, {
		$sort: {
			'_id.simpleCourseType': 1,
		},
	}, {
		$group: {
			_id: null,
			array: {
				$push: {
					k: '$_id.simpleCourseType',
					v: '$courseList',
				},
			},
		},
	}, {
		$project: {
			_id: 0,
			courseTypeList: { $arrayToObject: '$array' },
		},
	},
]).exec();

this.updateCourse = (query, update) => Course.findOneAndUpdate(query, update, { new: true }).exec();

this.doHeatmapUpdate = async (counts, specificSlot) => {
	const total = counts.find((e) => e._id.code === specificSlot.code
		&& e._id.course_type === specificSlot.course_type);
	const query = {
		code: specificSlot.code,
		slot: specificSlot.slot,
		faculty: specificSlot.faculty,
		course_type: specificSlot.course_type,
	};

	const update = {
		count: 0,
		total: 0,
		percent: 0,
		timestamp: Date.now(),
	};

	if (total) {
		update.count = specificSlot.count;
		update.total = total.count;
		update.percent = (specificSlot.count / total.count) * 100;
		update.timestamp = Date.now();
	}

	return this.updateCourse(query, update);
};


module.exports.getFullHeatmap = (regardless = false) => {
	if (!heatmap || regardless) { return this.fullHeatmapQuery(); }
	return heatmap;
};

module.exports.getCourseList = (regardless = false) => {
	if (courseList && !regardless) return courseList;
	return this.courseListQuery();
};

module.exports.getCourseFacultyList = (regardless = false) => {
	if (courseFacultyList && !regardless) return courseFacultyList;
	return this.courseFacultyListQuery();
};

module.exports.getCourseSlotList = (regardless = false) => {
	if (courseSlotList && !regardless) return courseSlotList;
	return this.courseSlotListQuery();
};

module.exports.getCourseTypeList = (regardless = false) => {
	if (courseTypeList && !regardless) return courseTypeList;
	return this.courseTypeListQuery();
};

module.exports.getNewCourseList = (regardless = false) => {
	if (newCourseList && !regardless) return newCourseList;
	return this.newCourseListQuery();
};

module.exports.getCourseDetails = (query) => Course.findOne(query).exec();

module.exports.parseXLSX = () => new Promise((resolve, reject) => {
	xlsx({
		input: xlsxInputFile,
		output: jsonOutputFile,
	}, (err, result) => {
		if (err) {
			return reject(err);
		}
		return resolve(result);
	});
});

module.exports.addCourseToDB = (course) => {
	// Add deletes for all unnecessary fields or add them to DB Model
	// if (course.seats) delete course.seats;

	// const two = ['EEE3999', 'CHE3999', 'CLE3999', 'CSE3999', 'ITE3999', 'SWE3999', 'MEE3999', 'ARC1013', 'ARC4008', 'BMG6007', 'MEE218', 'MEE305', 'ARC4008'];
	// const twelve = ['ITA3099', 'MMA3099'];
	// const fourteen = ['BST6099', 'ITA6099'];
	// const sixteen = ['BIT6099', 'EEE6099', 'ITE6099', 'MEE6099'];
	// const twenty = ['BIY599', 'CHE4099', 'CSE4099', 'CSE499', 'EEE4099', 'EEE499', 'EIE499', 'ECE4099', 'ITE4099', 'ITE499', 'MEE4099'];
	// const twentyfour = ['SWE3004', 'SWE599'];

	// const twoCreds = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2'];
	// const oneCreds = ['TA1', 'TA2', 'TAA1', 'TAA2', 'TB1', 'TB2', 'TBB2', 'TC1', 'TC2', 'TCC1', 'TCC2', 'TD1', 'TD2', 'TDD2', 'TE1', 'TE2', 'TF1', 'TF2', 'TG1', 'TG2'];

	// if (two.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE)) {
	// 	course.CREDITS = 2;
	// } else if (twelve.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE)) {
	// 	course.CREDITS = 12;
	// } else if (fourteen.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE)) {
	// 	course.CREDITS = 14;
	// } else if (sixteen.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE)) {
	// 	course.CREDITS = 16;
	// } else if (twenty.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE)) {
	// 	course.CREDITS = 20;
	// } else if (twentyfour.includes(course.CODE) && ['PJT', 'EPJ'].includes(course.TYPE)) {
	// 	course.CREDITS = 24;
	// } else if (course.TYPE === 'SS') {
	// 	course.CREDITS = 1;
	// } else if (['TH', 'ETH'].includes(course.TYPE)) {
	// 	const slots = course.SLOT.replace(' ', '').split('+');
	// 	course.CREDITS = slots.reduce((a, v) => {
	// 		if (oneCreds.includes(v)) return a + 1;
	// 		if (twoCreds.includes(v)) return a + 2;
	// 		return a;
	// 	}, 0);
	// } else if (['LO', 'ELA'].includes(course.TYPE)) {
	// 	course.CREDITS = course.SLOT.replace(' ', '').split('+').length / 2;
	// } else if (course.TYPE === 'EPJ') {
	// 	course.CREDITS = 1;
	// }

	let simpleCourseType; let
		shortCourseType;

	if (labTypes.includes(course.course_type)) {
		simpleCourseType = 'Lab';
		shortCourseType = 'L';
	}
	if (theoryTypes.includes(course.course_type)) {
		simpleCourseType = 'Theory';
		shortCourseType = 'T';
	}
	if (projectTypes.includes(course.course_type)) {
		simpleCourseType = 'Project';
		shortCourseType = 'P';
	}

	const queryData = {
		code: course.code,
		venue: course.venue,
		course_type: course.course_type,
		slot: course.slot.replace(' ', ''),
		faculty: course.faculty,
		credits: course.credits || 0,
	};

	const updateData = {
		code: course.code,
		venue: course.venue,
		course_type: course.course_type,
		simpleCourseType,
		shortCourseType,
		slot: course.slot.replace(' ', ''),
		faculty: course.faculty,
		credits: course.credits || 0,
		title: course.title,
		timestamp: Date.now(),
	};

	return Course.findOneAndUpdate(queryData, updateData,
		{ upsert: true, new: true, setDefaultsOnInsert: true }).exec();
};

module.exports.doCleanRemovedCourses = async () => {
	try {
		let current = await this.getCurrentCourseIDs();
		current = current.map((v) => v._id.toString());

		let selected = await this.getSelectedCourseIDs();
		selected = selected.map((v) => v._id.toString());

		const deletes = selected.filter((value) => !current.includes(value));

		const details = {
			currentCourses: current.length,
			selectedCourses: selected.length,
			deletes: deletes.length,
		};

		logger.info('Course Clean Details: ', details);

		const cleanDetails = await this.removeOldCoursesBulk(deletes);
		return cleanDetails;
	} catch (err) {
		logger.error('Error in doCleanRemovedCourses()');
		throw err;
	}
};

module.exports.cleanCoursesAfterRepopulate = (time) => Course.deleteMany({
	timestamp: { $lt: time },
}).exec();

module.exports.updateHeatmap = async () => {
	try {
		const initTime = new Date();
		logger.info(`Heatmap update started at: ${initTime}`);

		const counts = await userUtility.aggregateCounts();
		const specificCounts = await userUtility.aggregateSlotCounts();

		const updates = await Promise.all(specificCounts.map((slot) => this.doHeatmapUpdate(counts, slot)));

		const timestamp = await systemUtility.updateHeatmapUpdateTime();
		logger.info(`Heatmap update processed at: ${timestamp} in ${timestamp.getTime() - initTime}ms`);

		return { timestamp, docs: updates };
	} catch (err) {
		logger.error(`Error in updateHeatmap: ${err}`);
		throw err;
	}
};

cron.schedule('*/5 * * * *', () => {
	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
		// if (process.env.NODE_ENV !== 'staging') {
		logger.info('Updating cached heatmap');
		module.exports.getFullHeatmap(true).then((dat) => {
			heatmap = dat;
		});

		logger.info('Updating cached courseList');
		module.exports.getCourseList(true).then((dat) => {
			courseList = dat;
		});
	}
});

cron.schedule('*/10 * * * *', () => {
	if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'development') {
		logger.info('Running Heatmap Update');
		module.exports.updateHeatmap();
	}
});
