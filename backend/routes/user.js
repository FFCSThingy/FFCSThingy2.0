const express = require('express');
const { logger } = require('../utility/loggers.js');

const user = require('../utility/userUtility');


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
			res.json({
				success: false,
				message: 'Up to date',
			});
		}
	} catch (err) {
		res.status(500).json({ success: false, message: '/updateSelectedCoursesBulk failed' });
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
	} else { res.json({ success: false, message: 'Not signed in to VTOP' }); }
});


module.exports = router;
