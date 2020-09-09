const express = require('express');
const { logger } = require('../utility/loggers.js');

const Curriculum = require('../models/Curriculum');

// Utilities
const curriculum = require('../utility/curriculumUtility');
const consts = require('../utility/constants');

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
		res.status(500).json(consts.failJson(consts.messages.serverError));
		logger.error(`updateCurriculums: ${err}`);
	}
});

router.get('/allCurriculums', async (req, res) => {
	Curriculum.find({}, (err, doc) => {
		if (err) {
			logger.error(`/allCurriculums Error: ${err}`);
			return res.json(consts.failJson(consts.messages.serverError));
		}
		return res.json({ success: true, data: doc });
	});
});

router.get('/prefixes', async (req, res) => {
	try {
		const prefixesQueryResult = await curriculum.getCurriculumPrefixes();
		const prefixes = prefixesQueryResult.map((v) => v.reg_prefix);

		res.json({ success: true, data: prefixes });
	} catch (err) {
		logger.error(`Error in /getPrefixes ${err}`);
		res.status(500).json(consts.failJson(consts.messages.serverError));
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
		res.status(500).json(consts.failJson(consts.messages.serverError));
	}
});

module.exports = router;
