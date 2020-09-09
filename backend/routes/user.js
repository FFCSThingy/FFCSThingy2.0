const express = require('express');
const { logger } = require('../utility/loggers.js');

const user = require('../utility/userUtility');
const consts = require('../utility/constants');

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));

router.post('/syncTimetable', async (req, res) => {
	try {
		const reqTimestamp = req.body.timestamp || 10;

		const queryData = { _id: req.user.id };
		const updateData = {
			selected_courses: req.body.selected_courses,
			timestamp: new Date(reqTimestamp),
		};

		if (updateData.timestamp > req.user.timestamp) {
			const data = await user.updateUser(queryData, updateData);
			res.json({
				success: true,
				data: {
					timetable: data.selected_courses,
					timestamp: data.timestamp,
				},
			});
		} else if (updateData.timestamp < req.user.timestamp) {
			res.json({
				success: true,
				data: {
					timetable: req.user.selected_courses,
					timestamp: req.user.timestamp,
				},
			});
		} else {
			res.json(consts.failJson(consts.messages.upToDate));
		}
	} catch (err) {
		res.status(500).json(consts.failJson(consts.messages.serverError));
		logger.error(`Error in selectedCoursesBulk: ${err}`);
	}
});

router.get('/completedCourses', async (req, res) => {
	if (req.user.vtopSignedIn) {
		res.json({
			success: true,
			data: req.user.completed_courses.reduce((a, v) => {
				a[v.code] = v.grade;
				return a;
			}, {}),
		});
	} else {
		res.json(consts.failJson(consts.messages.notVtop));
	}
});


module.exports = router;
