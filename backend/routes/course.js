const express = require('express');
const cliProgress = require('cli-progress');
const { logger } = require('../utility/loggers.js');

// Utilities
const curriculum = require('../utility/curriculumUtility');
const course = require('../utility/courseUtility');
const system = require('../utility/systemUtility');
const consts = require('../utility/constants');

const prereqJSON = require('../data/prereqs.json');

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));

router.get('/fullHeatmap/:timestamp?', async (req, res) => {
	try {
		const systemTimestamp = await system.getHeatmapUpdateTime();
		const reqTimestamp = req.params.timestamp || 10;

		if (!reqTimestamp || new Date(reqTimestamp) < new Date(systemTimestamp)) {
			return res.json({
				success: true,
				data: {
					heatmap: await course.getFullHeatmap(),
					timestamp: systemTimestamp,
				},
			});
		}
		return res.status(304).json(consts.failJson(consts.messages.upToDate));
	} catch (err) {
		return res.status(500).json(consts.failJson(consts.messages.serverError));
	}
});

router.get('/allCourseLists/:timestamp?', async (req, res) => {
	try {
		const systemTimestamp = await system.getRepopulateTime();
		const reqTimestamp = req.params.timestamp || 10;
		let courseList;
		let courseFacultyList;
		let courseSlotList;
		let courseTypeList;

		if (!reqTimestamp || new Date(reqTimestamp) < new Date(systemTimestamp)) {
			courseList = await course.getNewCourseList();
			courseFacultyList = await course.getCourseFacultyList();
			courseSlotList = await course.getCourseSlotList();
			courseTypeList = await course.getCourseTypeList();

			return res.json({
				success: true,
				data: {
					courseList: courseList[0].courseList,
					courseSlotList: courseSlotList[0].courseSlotList,
					courseFacultyList: courseFacultyList[0].list,
					courseTypeList: courseTypeList[0].courseTypeList,
					prerequisites: prereqJSON,
					timestamp: systemTimestamp,
				},
			});
		}
		return res.status(304).json(consts.failJson(consts.messages.upToDate));
	} catch (err) {
		logger.error(err);
		return res.status(500).json(consts.failJson(consts.messages.serverError));
	}
});

// Gets credits from curriculuma dn populates the list
router.get('/courseListFromCurriculum', async (req, res) => {
	let creditList;
	const systemTimestamp = new Date(await system.getRepopulateTime());

	const courseList = await course.getCourseList();
	// const creditList = await curriculum.getCreditCounts();
	creditList = await curriculum.creditsFromCurriculumQuery();
	creditList = creditList[0].list;

	const data = courseList.map((v) => {
		v.credits = creditList[v.code] || 0;
		return v;
	});

	return res.json({
		success: true,
		data: {
			courseList: data,
			timestamp: systemTimestamp,
		},
	});
});

// Calls Callback function with updated count on every resolve
function doBarUpdate(promises, progressCallback) {
	let d = 0;
	progressCallback(0);
	// eslint-disable-next-line no-restricted-syntax
	for (const p of promises) {
		// eslint-disable-next-line no-loop-func
		p.then(() => progressCallback(
			// eslint-disable-next-line no-plusplus
			++d,
		));
	}

	return Promise.all(promises);
}

router.get('/addCoursesToDB/SuckOnDeezNumbNutz', async (req, res) => {
	try {
		const courses = await course.parseXLSX();

		const repopTime = await system.updateRepopulateTime();

		system.updateHeatmapUpdateTime();

		const actions = courses.map(course.addCourseToDB);

		logger.warn('Starting Courses Add/Update');
		// Makes a progress Bar, 0 to actions.length
		const addCoursesBar = new cliProgress.SingleBar({
			format: 'Adding Courses: |{bar}| {percentage}% | {value}/{total} | {duration}s',
		}, cliProgress.Presets.shades_classic);
		addCoursesBar.start(actions.length, 0);
		// Pass a callback function.
		const results = await doBarUpdate(actions, (p) => {
			addCoursesBar.update(p);
		});
		addCoursesBar.stop();
		logger.warn('Finished Courses Add/Update');

		const deletes = await course.cleanCoursesAfterRepopulate(repopTime);
		const cleanDetails = await course.doCleanRemovedCourses();

		return res.json({ updates: results, deletes, cleanDetails });
	} catch (err) {
		logger.error(`addCoursesToDB Error: ${err}`);
		return res.status(500).json(consts.failJson(consts.messages.serverError));
	}
});

router.get('/courseByDetails/:code/:type/:faculty/:venue/:slot', async (req, res) => {
	try {
		const data = {
			code: req.params.code,
			course_type: req.params.type,
			faculty: req.params.faculty,
			venue: req.params.venue,
			slot: req.params.slot,
		};

		const doc = await course.getCourseDetails(data);

		if (doc) {
			res.json({ success: true, data: doc });
		} else {
			res.status(404).json(consts.failJson(consts.messages.notFound));
		}
	} catch (err) {
		res.status(500).json(consts.failJson(consts.messages.serverError));
		logger.error(`courseByDetails Error: ${err}`);
	}
});

router.get('/courseByID/:id', async (req, res) => {
	try {
		const data = {
			_id: req.params.id,
		};

		const doc = await course.getCourseDetails(data);

		if (doc) {
			res.json({ success: true, data: doc });
		} else {
			res.status(404).json(consts.failJson(consts.messages.notFound));
		}
	} catch (err) {
		res.status(500).json(consts.failJson(consts.messages.serverError));
		logger.error(`courseByID Error: ${err}`);
	}
});

router.get('/updateHeatmap', async (req, res) => {
	try {
		const doc = await course.updateHeatmap();
		res.json(doc);
	} catch (err) {
		logger.error(err);
	}
});

router.get('/cleanDemOldCourses/SuckOnDeezNumbNutz', async (req, res) => {
	try {
		const data = await course.doCleanRemovedCourses();
		res.send(data);
	} catch (err) {
		logger.error(err);
	}
});

module.exports = router;
