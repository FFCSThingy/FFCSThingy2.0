const System = require('../models/System');

module.exports.updateRepopulateTime = () => {
	return new Promise((resolve, reject) => {
		System.findOneAndUpdate({}, { courseRepopulateTime: Date.now() },
		{ upsert: true, new: true }, function(err, doc) {
			if(err) return reject(err);
			return resolve(doc.courseRepopulateTime);
		});
	});
}

module.exports.getRepopulateTime = () => {
	return new Promise((resolve, reject) => {
		System.findOne({}, function (err, doc) {
				if (err) return reject(err);
				return resolve(doc.courseRepopulateTime);
			});
	});
}

module.exports.updateHeatmapUpdateTime = () => {
	return new Promise((resolve, reject) => {
		System.findOneAndUpdate({}, { heatmapUpdateTime: Date.now() },
			{ upsert: true, new: true }, function (err, doc) {
				if (err) return reject(err);
				return resolve(doc.heatmapUpdateTime);
			});
	});
}

module.exports.getHeatmapUpdateTime = () => {
	return new Promise((resolve, reject) => {
		System.findOne({}, function (err, doc) {
			if (err) return reject(err);
			return resolve(doc.heatmapUpdateTime);
		});
	});
}