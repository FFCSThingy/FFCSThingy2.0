const express = require('express');

// Utilities
const curriculum = require('../utility/curriculumUtility');
const user = require('../utility/userUtility');
const course = require('../utility/courseUtility');
const system = require('../utility/systemUtility');
const { resolve } = require('path');

var courseReportJSON = require('../data/report.json');

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));

router.get('/fullHeatmap/:timestamp?', async (req, res, next) => {
	try {
		var systemTimestamp = new Date(await system.getHeatmapUpdateTime());
		if (!req.params.timestamp)
			return res.json({
				success: true,
				data: {
					heatmap: await course.getFullHeatmap(),
					timestamp: await system.getHeatmapUpdateTime()
				}
			});

		var reqTimestamp = new Date(req.params.timestamp)


		if (reqTimestamp < systemTimestamp)
			return res.json({
				success: true,
				data: {
					heatmap: await course.getFullHeatmap(),
					timestamp: await system.getHeatmapUpdateTime()
				}
			});
		else
			res.status(304).json({ success: true, message: "Up To Date" });
	} catch (err) {
		res.status(500).json({ success: false, message: '/getFullHeatmap failed' });
	}

});

router.get('/courseList/:timestamp?', async (req, res, next) => {
	try {
		var systemTimestamp = new Date(await system.getRepopulateTime());

		if (!req.params.timestamp)
			return res.json({
				success: true,
				data: {
					courseList: await course.getCourseList(),
					timestamp: systemTimestamp
				}
			});

		var reqTimestamp = new Date(req.params.timestamp)

		if (reqTimestamp < systemTimestamp)
			return res.json({
				success: true,
				data: {
					courseList: await course.getCourseList(),
					timestamp: systemTimestamp
				}
			});
		else
			res.status(304).json({ success: true, message: "Up To Date" });
	} catch (err) {
		res.status(500).json({ success: false, message: '/getCourseList failed' });
	}
});

router.get('/newCourseList', async (req, res, next) => {
	var systemTimestamp = new Date(await system.getRepopulateTime());

	var courseList = await course.getCourseList();
	var creditList = await curriculum.getCreditCounts();
	// res.json(creditList);
	// res.json(creditList['ARB1001'])
	var data = courseList.map(v => {
		v.credits = creditList[v.code] || 0;
		return v;
	});

	return res.json({
		success: true,
		data: {
			courseList: data,
			timestamp: systemTimestamp
		}
	});

	// res.json(data);
});

// router.post('/parseCourses', async (req, res, next) => {
// 	if (req.body.password != "SuckOnDeezNumbNutz")
// 		res.status(403).json({ success: false, message: "Get the password right, bitchface." });
// });

// router.get('/parseCourses', async (req, res, next) => {
// 	try {
// 		var parsedData = await course.parseXLSX();
// 		res.json(parsedData);
// 	} catch (err) {
// 		res.status(500).json({ success: false, message: '/parseCourses failed' });
// 		console.log(err);
// 	}
// });

router.get('/addCoursesToDB/SuckOnDeezNumbNutz', async (req, res, next) => {
	try {
		// var courses = await course.parseXLSX();

		var repopTime = await system.updateRepopulateTime();

		// TODO: Replace this with the user timetable scrolling, verifying thing and update heatmap
		system.updateHeatmapUpdateTime();

		// var actions = courses.map(course.addCourseToDB);
		var actions = courseReportJSON.map(course.addCourseToDB);
		var results = await Promise.all(actions);

		var deletes = await course.cleanCoursesAfterRepopulate(repopTime);

		res.json({ updates: results, deletes: deletes });

	} catch (err) {
		res.status(500).json({ success: false, message: '/addCoursesToDB failed' });
		console.log(err);
	}
});

router.get('/courseByDetails/:code/:type/:faculty/:venue/:slot', async (req, res, next) => {
	try {
		var data = {
			code: req.params.code,
			course_type: req.params.type,
			faculty: req.params.faculty,
			venue: req.params.venue,
			slot: req.params.slot
		};

		var doc = await course.getCourseDetails(data)

		if (doc)
			res.json({ success: true, data: doc });
		else
			res.status(404).json({ success: false, message: 'Not found' });

	} catch (err) {
		res.status(500).json({ success: false, message: '/getCourseByDetails failed' });
		console.log(err);
	}
});

router.get('/courseByID/:id', async (req, res, next) => {
	try {
		var data = {
			_id: req.params.id,
		};

		var doc = await course.getCourseDetails(data)

		if (doc)
			res.json({ success: true, data: doc });
		else
			res.status(404).json({ success: false, message: 'Not found' });

	} catch (err) {
		res.status(500).json({ success: false, message: '/getCourseByID failed' });
		console.log(err);
	}
});

// router.get('/updateHeatmap', async(req, res, next) => {
// 	try {
// 		var doc = await course.updateHeatmap();
// 		res.json(doc);
// 	} catch(err) {
// 		console.log(err);
// 	}
// });

module.exports = router;