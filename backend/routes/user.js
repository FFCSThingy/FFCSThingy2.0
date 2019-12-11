const express = require('express');
const { logger } = require('../utility/loggers.js');

const user = require('../utility/userUtility');


const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));

router.get('/selectedCourses', async (req, res) => {
	try {
		const data = req.user.selected_courses;
		res.json({ success: true, data });
	} catch (err) {
		res.status(500).json({ success: false, message: '/getSelectedCourses failed' });
		logger.error(`Error in getSelectedCourses: ${err}`);
	}
});

router.post('/selectedCoursesBulk', async (req, res) => {
	try {
		const queryData = { _id: req.user.id };
		const updateData = { selected_courses: req.body.selected_courses };

		const data = await user.updateUser(queryData, updateData);
		res.json({ success: true, data });
	} catch (err) {
		res.status(500).json({ success: false, message: '/updateSelectedCoursesBulk failed' });
		logger.error(`Error in selectedCoursesBulk: ${err}`);
	}
});

router.post('/selectedCurriculum', async (req, res) => {
	try {
		const queryData = { _id: req.user.id };
		const updateData = { selected_curriculum: req.body.selected_curriculum };

		const data = await user.updateUser(queryData, updateData);
		res.json({ success: true, data });
	} catch (err) {
		res.status(500).json({ success: false, message: '/setSelectedCurriculum failed' });
		logger.error(`Error in selectedCurriculum: ${err}`);
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
