import fs from 'fs';
import path from 'path';

// Models
import Curriculum from '../models/Curriculum';
import User from '../models/User';
import Course from '../models/Course';

module.exports.getFullHeatmap = () => {
	return new Promise((resolve, reject) => {
		Course.aggregate([
			{
				$project: {
					_id: 0
				}
			}
		], function(err, doc) {
			if(err) return reject(err);
			return resolve(doc);
		});
	});
}