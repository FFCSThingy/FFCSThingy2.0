const express = require('express');
const { logger } = require('../utility/loggers.js');

const Curriculum = require('../models/Curriculum');

// Utilities
const curriculum = require('../utility/curriculumUtility');
const user = require('../utility/userUtility');

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));

router.get('/updateCurriculums/SuckOnDeezNumbNutz', (req, res) => {
	const currs = ['16BCE', '16BEC', '16BEM', '16BIT', '16BME', '17BCE', '17BCI', '17BEC', '17BEM', '17BIS', '17BIT', '17BMD', '17BME', '18BCB', '18BCE', '18BCI', '18BCL', '18BEC', '18BEE', '18BIT'];
	const actions = currs.map(curriculum.doParseAndSaveCurriculum);
	const results = Promise.all(actions);

	results.then((data) => res.send(data))
		.catch((err) => logger.error(`updateCurriculums: ${err}`));
});

router.get('/updateSpecificCurriculum/SuckOnDeezNumbNutz/:regPrefix', async (req, res) => {
	try {
		const data = await curriculum.doParseAndSaveCurriculum(req.params.regPrefix);
		res.send(data);
	} catch (err) {
		logger.error(`updateCurriculums: ${err}`);
	}
});

router.get('/allCurriculums', async (req, res) => {
	Curriculum.find({}, (err, doc) => {
		if (err) return res.json({ success: false, message: 'Route error' }); // reject(err);
		return res.json({ success: true, data: doc }); // resolve(doc);
	});
});

router.get('/prefixes', async (req, res) => {
	try {
		const prefixesQueryResult = await curriculum.getCurriculumPrefixes();
		const prefixes = prefixesQueryResult.map((v) => v.reg_prefix);

		res.json({ success: true, data: prefixes });
	} catch (err) {
		logger.error(`Error in /getPrefixes ${err}`);
		res.status(500).json({ success: false, error: 'Error in /getPrefixes' });
	}
});

router.get('/curriculumFromPrefix/:prefix', async (req, res) => {
	try {
		const doc = await curriculum.findCurriculumFromPrefix(req.params.prefix);
		if (doc) {
			res.json({ success: true, data: doc });
		} else {
			res.json({ success: false, error: 'Not Found' });
		}
	} catch (err) {
		logger.error(`Error in /curriculumFromPrefix ${err}`);
		res.status(500).json({ success: false, error: 'Error in /curriculumFromPrefix' });
	}
});


router.post('/curriculumForUser', async (req, res) => {
	try {
		const currDoc = await curriculum.findCurriculumFromPrefix(req.body.reg_prefix);
		const userDoc = await user.updateUser({ google_id: req.body.google_id },
			{ reg_prefix: currDoc.reg_prefix });

		res.json({ succes: true, data: userDoc });
	} catch (err) {
		logger.error(`Error in /selectCurriculumForUser ${err}`);
		res.status(500).json({ success: false, error: 'Error in /selectCurriculumForUser' });
	}
});

module.exports = router;
