import fs from 'fs';
import path from 'path';

// Scrapers
import grades from '../scrapers/userhistory';
import curriculum from '../scrapers/curriculum';

// Models
import Curriculum from '../models/Curriculum';
import User from '../models/User';


module.exports.findUser = function findUser() {

}

module.exports.updateUser = function updateUser(query, update, upsert=false, newVal=true) {
	return new Promise((resolve, reject) => {
		User.findOneAndUpdate(query, update, { upsert: upsert, new: newVal },
			function (err, doc) {
				if(err) return reject(err);
				return resolve(doc);
			});
	});
}