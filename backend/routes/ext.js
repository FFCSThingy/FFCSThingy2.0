const express = require('express');
const fs = require('fs');
const path = require('path');

const grades = require('../scrapers/userhistory');
const curriculum = require('../scrapers/curriculum');

const userUtility = require('../utility/userUtility');
const curriculumUtility = require('../utility/curriculumUtility');
const consts = require('../utility/constants');
const { logger } = require('../utility/loggers.js');

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));


router.post('/processExtensionData', async (req, res) => {
	if (req.body.url === 'examinations/examGradeView/StudentGradeHistory') {
		logger.info(`Parsing UserHistory Data for ${req.user.display_name} - ${req.body.ID}`);
		const userhistory = await grades.parseUserHistory(req.body.data, req.body.ID);

		if (typeof userhistory.completed_courses !== 'undefined' && userhistory.completed_courses.length > 0) {
			userhistory.vtopSignedIn = true;
			logger.debug(`UserHistory: ${userhistory}`);

			const userDoc = userUtility.updateUser({ _id: req.user._id }, userhistory);

			return res.json({ success: true, data: userDoc });
		}

		return res.status(500).json(consts.failJson(consts.messages.serverError));
	}

	if (req.body.url === 'academics/common/Curriculum') {
		logger.info(`Parsing Curriculum Data for ${req.user.display_name} - ${req.body.ID}`);
		const curr = await curriculum.parseCurriculum(req.body.data, req.body.ID);
		const currDoc = await curriculumUtility.addCurriculumFromExt(curr);
		return res.send(currDoc);
	}

	return res.status(404).json(consts.failJson(consts.messages.unknownParam));
});

router.get('/testCurriculum', (req, res) => {
	fs.readFile(path.join(__dirname, '../samples/19-curriculum.html'), async (error, pgResp) => {
		if (error) {
			logger.error(`Test Curriculum Error: ${error}`);
			return res.status(500).json(consts.failJson(consts.messages.serverError));
		}

		const curr = await curriculum.parseCurriculum(pgResp);
		// res.json(curr);
		logger.debug(`Test Curriculum RegPrefix: ${curr.reg_prefix}`);
		const currDoc = await curriculumUtility.addCurriculumFromExt(curr);
		return res.send(currDoc);
	});
});

router.get('/testGrades', (req, res) => {
	fs.readFile(path.join(__dirname, '../samples/19-gradeHistory.html'), async (error, pgResp) => {
		if (error) {
			logger.error(`Test Grades Error: ${error}`);
			return res.status(500).json(consts.failJson(consts.messages.serverError));
		}

		const resp = await grades.parseUserHistory(pgResp);
		return res.send(resp);
	});
});

module.exports = router;
