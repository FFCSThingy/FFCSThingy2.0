const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const grades = require('../scrapers/userhistory');
const curriculum = require('../scrapers/curriculum');

const userUtility = require('../utility/userUtility');
const curriculumUtility = require('../utility/curriculumUtility');


const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));


router.post('/processExtensionData', async (req, res, next) => {
	// console.log(req.body.ID);

	// var data;
	if (req.body.url == 'examinations/examGradeView/StudentGradeHistory') {
		var userhistory = await grades.parseUserHistory(req.body.data, req.body.ID);
		userhistory.vtopSignedIn = true;
		// console.log(userhistory);
		var userDoc = userUtility.updateUser({_id: req.user._id}, userhistory);
		res.send(userDoc);
	}

	if (req.body.url == 'academics/common/Curriculum') {
		var curr = await curriculum.parseCurriculum(req.body.data, req.body.ID);
		// console.log(curr.reg_prefix);
		var currDoc = await curriculumUtility.addCurriculumFromExt(curr);
		res.send(currDoc);
	}
});

router.get('/testCurriculum', (req, res, next) => {
	fs.readFile(path.join(__dirname, '../samples/curriculum/16BCE.html'), async function (error, pgResp) {
		if (error) {
			console.log(error);
		} else {
			// var resp = await curriculum.parseCurriculum(pgResp);
			var curr = await curriculum.parseCurriculum(pgResp);
			console.log(curr.reg_prefix);
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