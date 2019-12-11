const fs = require('fs');
const path = require('path');
const { logger } = require('./loggers.js');

// Scrapers
const curriculumScraper = require('../scrapers/curriculum');

// Models
const Curriculum = require('../models/Curriculum');

module.exports.getCreditsFromCurriculum = () => Curriculum.aggregate([
	{ $project: { _id: 0, courses: { $concatArrays: ['$uc', '$pc', '$ue', '$pe'] } } },
	{ $unwind: '$courses' },
	{
		$group: {
			_id: {
				code: '$courses.code',
				credits: '$courses.c',
			},

		},
	}, {
		$group: {
			_id: null,
			array: {
				$push: {
					k: '$_id.code',
					v: '$_id.credits',
				},
			},
		},
	},
	{
		$project: {
			_id: 0,
			list: { $arrayToObject: '$array' },
		},
	},
]).exec();

module.exports.findCurriculumFromPrefix = (regPrefix) => Curriculum.findOne({
	reg_prefix: regPrefix,
}).exec();

module.exports.getCurriculumPrefixes = () => Curriculum.aggregate(
	[{
		$project: {
			reg_prefix: 1,
			_id: 0,
		},
	}, {
		$sort: {
			reg_prefix: -1,
		},
	}],
).exec();

module.exports.doParseAndSaveCurriculum = function doParseAndSaveCurriculum(filename) {
	return new Promise((resolve, reject) => {
		const filepath = path.join(__dirname, `../samples/curriculum/${filename}.html`);

		fs.readFile(filepath, async (error, pgResp) => {
			if (error) {
				logger.info(`Error in doParseAndSaveCurriculum: ${error}`);
			} else {
				const resp = await curriculumScraper.parseCurriculum(pgResp);
				resp.reg_prefix = filename;

				Curriculum.findOneAndUpdate({ reg_prefix: filename }, resp,
					{ upsert: true, new: true, setDefaultsOnInsert: true },
					(err, doc) => {
						if (err) return reject(err);
						return resolve(doc);
					});
			}
		});
	});
};

module.exports.addCurriculumFromExt = (curriculum) => new Promise((resolve, reject) => {
	Curriculum.findOne({ reg_prefix: curriculum.reg_prefix }, (err, doc) => {
		if (!doc) {
			Curriculum.findOneAndUpdate({ reg_prefix: curriculum.reg_prefix },
				curriculum,
				{ upsert: true, new: true, rawResult: true },
				() => resolve('Curriculum not found, adding.'));
		} else if (err) return reject(err);
		return resolve('Unmodified, Already Exists.');
	});
});
