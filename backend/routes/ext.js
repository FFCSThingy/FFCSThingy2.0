import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

import grades from '../scrapers/userhistory';
import curriculum from '../scrapers/curriculum';

import userUtility from '../utility/userUtility';
import curriculumUtility from '../utility/curriculumUtility';


const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));


router.post('/processExtensionData', async (req, res, next) => {
	// var data;
	if (req.body.url == 'examinations/examGradeView/StudentGradeHistory') {
		var userhistory = await grades.parseUserHistory(req.body.data);
		userhistory.vtopSignedIn = true;
		var userDoc = userUtility.updateUser({_id: req.user._id}, userhistory);
		res.send(userDoc);
	}

	if (req.body.url == 'academics/common/Curriculum') {
		var curr = await curriculum.parseCurriculum(req.body.data);
		var currDoc = await curriculumUtility.addCurriculumFromExt(curr);
		res.send(currDoc);
	}
});

router.get('/testCurriculum', (req, res, next) => {
	fs.readFile(path.join(__dirname, '../samples/curriculum.html'), async function (error, pgResp) {
		if (error) {
			console.log(error);
		} else {
			// var resp = await curriculum.parseCurriculum(pgResp);
			var curr = await curriculum.parseCurriculum(pgResp);
			var currDoc = await curriculumUtility.addCurriculumFromExt(curr);
			res.send(currDoc);
			// res.send(resp);
		}

	});
});

router.get('/testGrades', (req, res, next) => {
	fs.readFile(path.join(__dirname, '../samples/gradeHistory.html'), async function (error, pgResp) {
		if (error) {
			console.log(error);
		} else {
			var resp = await grades.parseUserHistory(pgResp);
			res.send(resp);
		}

	});
});

module.exports = router;