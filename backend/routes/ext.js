import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

import grades from '../scrapers/userhistory';
import curriculum from '../scrapers/curriculum';


const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));


router.post('/processExtensionData', async (req, res, next) => {
	// if (req.body.url == 'examinations/examGradeView/StudentGradeHistory') 
		// return grades.parseUserHistory(req.body.data);
	if (req.body.url == 'academics/common/Curriculum')
		res.send(await curriculum.parseCurriculum(req.body.data));
});

router.get('/testCurriculum', (req, res, next) => {
	fs.readFile(path.join(__dirname, '../samples/curriculum.html'), async function (error, pgResp) {
		if (error) {
			console.log(error);
		} else {
			var resp = await curriculum.parseCurriculum(pgResp);
			res.send(resp);
		}

	});
});

router.get('/testGrades', (req, res, next) => {
	
});

module.exports = router;