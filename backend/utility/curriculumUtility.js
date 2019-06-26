const fs = require('fs');
const path = require('path');

// Scrapers
const grades = require('../scrapers/userhistory');
const curriculum = require('../scrapers/curriculum');

// Models
const Curriculum = require('../models/Curriculum');
const User = require('../models/User');


module.exports.doParseAndSaveCurriculum = function doParseAndSaveCurriculum(filename) {
	return new Promise((resolve, reject) => {
		var filepath = path.join(__dirname, '../samples/curriculum/' + filename + '.html');

		fs.readFile(filepath, async function (error, pgResp) {
			if (error) {
				console.log('Error in doParseAndSaveCurriculum: ' + error);
			} else {
				var resp = await curriculum.parseCurriculum(pgResp);
				resp.reg_prefix = filename;

				Curriculum.findOneAndUpdate({ reg_prefix: filename }, resp, { upsert: true, new: true, setDefaultsOnInsert: true },
					function (err, doc) {
						if (err) return reject(err);
						return resolve(doc);
					});
			}
		});
	});
}

module.exports.getCreditCounts = () => {
	return new Promise((resolve, reject) => {
		Curriculum.aggregate([
			{ $project: { _id: 0, courses: { $concatArrays: ['$uc', '$pc', '$ue', '$pe'] } } },
			{ $unwind: '$courses' },
			{ 
				$group: { 
					_id: { 
						code: '$courses.code',
						credits: '$courses.c'
					}
					
				} 
			}, {
				$project: {
					code: '$_id.code',
					credits: '$_id.credits',
					_id: 0
				}
			}
		], function(err, data) {
			if(err) return reject(err);
			// if(err) console.log(err);
			data = data.reduce((a,v) => {
				a[v.code] = v.credits;
				return a;
			}, {})

			return resolve(data);
		});
	});
}

module.exports.findCurriculumFromPrefix = function findCurriculumFromPrefix(reg_prefix) {
	return new Promise((resolve, reject) => {
		Curriculum.findOne({ reg_prefix: reg_prefix }, function (err, doc) {
			if (err) {
				console.log('Error in findCurriculumFromPrefix: ' + err);
				return reject(err);
			}

			else return resolve(doc);
		});
	});
}

module.exports.addCurriculumFromExt = (curriculum) => {
	return new Promise((resolve, reject) => {
		Curriculum.findOne({reg_prefix: curriculum.reg_prefix}, (err, doc) => {
			if (!doc) Curriculum.findOneAndUpdate({ reg_prefix: curriculum.reg_prefix },
				curriculum,
				{ upsert: true, new: true, rawResult: true }, function(err, doc) {
					// return resolve(doc)
					return resolve('Curriculum not found, adding.')
				});
			else if(err) return reject(err);
			else return resolve('Unmodified, Already Exists.');	
		})
	});
	// 	Curriculum.findOneAndUpdate(curriculum,
	// 		// { $setOnInsert: curriculum },
	// 		curriculum,
	// 		{ upsert: true, new: true, rawResult: true }, function (err, doc, res) {
	// 			console.log(err);
	// 			// console.log(doc);
	// 			console.log(res);
	// 			return resolve({ timestamp: new Date(), doc: doc })
	// 		});
	// });
}

module.exports.getCurriculumPrefixes = () => {
	return new Promise((resolve, reject) => {
		Curriculum.aggregate(
			[{
				$project: {
					reg_prefix: 1,
					_id: 0
				}
			}, {
				$sort: {
					reg_prefix: 1
				}
			}], function (err, data) {
				if (err) return reject(err);
				else {
					data = data.map((dat) => dat.reg_prefix);
					return resolve(data);
				}
			}
		);
	})
}