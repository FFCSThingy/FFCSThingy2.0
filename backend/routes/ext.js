const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const grades = require('../scrapers/userhistory');
const curriculum = require('../scrapers/curriculum');

const userUtility = require('../utility/userUtility');
const curriculumUtility = require('../utility/curriculumUtility');
const { logger } = require('../utility/loggers.js');

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));


router.post('/processExtensionData', async (req, res, next) => {
	if (req.body.url == 'examinations/examGradeView/StudentGradeHistory') {
		logger.log('Parsing UserHistory Data for ' + req.user.display_name + " - " + req.body.ID);
		var userhistory = await grades.parseUserHistory(req.body.data, req.body.ID);
		
		if (typeof userhistory.completed_courses !== 'undefined' && userhistory.completed_courses.length > 0) {
			userhistory.vtopSignedIn = true;
			logger.log('UserHistory: ' + userhistory);
			var userDoc = userUtility.updateUser({ _id: req.user._id }, userhistory);
			res.json({ success: true, data: userDoc });
		}
		else res.json({ success: false, message: 'Error in parsing user history' });
	}

	if (req.body.url == 'academics/common/Curriculum') {
		logger.log('Parsing Curriculum Data for ' + req.user.display_name + " - " + req.body.ID);
		var curr = await curriculum.parseCurriculum(req.body.data, req.body.ID);
		var currDoc = await curriculumUtility.addCurriculumFromExt(curr);
		res.send(currDoc);
	}
});

router.get('/testCurriculum', (req, res, next) => {
	fs.readFile(path.join(__dirname, '../samples/curriculum/16BCE.html'), async function (error, pgResp) {
		if (error) {
			logger.error('Test Curriculum Error: ' + error);
		} else {
			var curr = await curriculum.parseCurriculum(pgResp);
			logger.log('Test Curriculum RegPrefix: ' + curr.reg_prefix);
			var currDoc = await curriculumUtility.addCurriculumFromExt(curr);
			res.send(currDoc);
		}

	});
});

router.get('/testGrades', (req, res, next) => {
	fs.readFile(path.join(__dirname, '../samples/gradeHistory.html'), async function (error, pgResp) {
		if (error) {
			logger.error('Test Grades Error: ' + error);
		} else {
			var resp = await grades.parseUserHistory(pgResp);
			res.send(resp);
		}

	});
});

module.exports = router;