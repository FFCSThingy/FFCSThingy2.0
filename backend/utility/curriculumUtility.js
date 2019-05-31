import fs from 'fs';
import path from 'path';

// Scrapers
import grades from '../scrapers/userhistory';
import curriculum from '../scrapers/curriculum';

// Models
import Curriculum from '../models/Curriculum';
import User from '../models/User';


module.exports.doParseAndSaveCurriculum = function doParseAndSaveCurriculum(filename) {
	return new Promise((resolve, reject) => {
		var filepath = path.join(__dirname, '../samples/curriculum/' + filename + '.html');

		fs.readFile(filepath, async function (error, pgResp) {
			if (error) {
				console.log(error);
			} else {
				var resp = await curriculum.parseCurriculum(pgResp);
				resp.reg_prefix = filename;

				Curriculum.findOneAndUpdate({ reg_prefix: filename }, resp, { upsert: true, new: true },
					function (err, doc) {
						if (err) return reject(err);
						return resolve(doc);
					});
			}
		});
	});
}

module.exports.findCurriculumFromPrefix = function findCurriculumFromPrefix(reg_prefix) {
	return new Promise((resolve, reject) => {
		Curriculum.findOne({ reg_prefix: reg_prefix }, function (err, doc) {
			if (err) {
				console.log(err);
				return reject(err);
			}

			else return resolve(doc);
		});
	});
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