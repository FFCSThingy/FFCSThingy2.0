import fs from 'fs';
import path from 'path';

// Scrapers
import grades from '../scrapers/userhistory';
import curriculum from '../scrapers/curriculum';

// Models
import Curriculum from '../models/Curriculum';
import User from '../models/User';


module.exports.findUserByID = function findUserByID(id) {
	return new Promise((resolve, reject) => {
		User.findById(id, function(err, doc) {
			if(err) return reject(err);
			return resolve(doc);
		})
	});
}

module.exports.updateUser = (query, update, 
	upsert=false, newVal=true, setDefaultsVal=true) => {
		
	return new Promise((resolve, reject) => {
		update.timestamp = Date.now();
		User.findOneAndUpdate(query, update, 
			{ upsert: upsert, new: newVal, setDefaultsOnInsert: setDefaultsVal},
			function (err, doc) {
				if(err) return reject(err);
				return resolve(doc);
			});
	});
}