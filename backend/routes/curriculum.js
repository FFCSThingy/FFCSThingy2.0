const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Utilities
const curriculum = require('../utility/curriculumUtility');
const user = require('../utility/userUtility');

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));

router.get('/updateCurriculums/SuckOnDeezNumbNutz', (req, res, next) => {
	var currs = ['16BCE', '16BEC', '16BEM', '16BIT', '16BME', '17BCE', '17BCI', '17BEC', '17BEM', '17BIT', '17BME'];
	var actions = currs.map(curriculum.doParseAndSaveCurriculum);
	var results = Promise.all(actions);

	results.then(data => res.send(data))
	.catch(err => console.log(err));
});

router.get('/prefixes', async (req, res, next) => {
	try {
		var prefixes = await curriculum.getCurriculumPrefixes();
		res.json({ success: true, data: prefixes });
	} catch(err) {
		console.log("Error in /getPrefixes");
		console.log(err);
		res.status(500).json({ success: false, error: "Error in /getPrefixes" });
	}
});

router.get('/curriculumFromPrefix/:prefix', async (req, res, next) => {
	try {
		var doc = await curriculum.findCurriculumFromPrefix(req.params.prefix);
		res.json({ success:true, data: doc });
	} catch(err) {
		console.log("Error in /curriculumFromPrefix");
		console.log(err);
		res.status(500).json({ success: false, error: "Error in /curriculumFromPrefix" });
	}
});


router.post('/curriculumForUser', async (req, res, next) => {
	try {	
		var currDoc = await curriculum.findCurriculumFromPrefix(reg_prefix);
		var userDoc = await user.updateUser({ google_id: req.body.google_id }, 
			{ reg_prefix: currDoc.reg_prefix });

		res.json({ succes: true, data: userDoc });

	} catch(err) {
		console.log("Error in /selectCurriculumForUser");
		console.log(err);
		res.status(500).json({ success: false, error: "Error in /selectCurriculumForUser" });
	}
});

module.exports = router;