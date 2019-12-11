const System = require('../models/System');

module.exports.updateRepopulateTime = () => new Promise((resolve, reject) => {
	System.findOneAndUpdate({}, { courseRepopulateTime: Date.now() },
		{ upsert: true, new: true }, (err, doc) => {
			if (err) return reject(err);
			return resolve(doc.courseRepopulateTime);
		});
});

module.exports.getRepopulateTime = () => new Promise((resolve, reject) => {
	System.findOne({}, (err, doc) => {
		if (err) return reject(err);
		return resolve(doc.courseRepopulateTime);
	});
});

module.exports.updateHeatmapUpdateTime = () => new Promise((resolve, reject) => {
	System.findOneAndUpdate({}, { heatmapUpdateTime: Date.now() },
		{ upsert: true, new: true }, (err, doc) => {
			if (err) return reject(err);
			return resolve(doc.heatmapUpdateTime);
		});
});

module.exports.getHeatmapUpdateTime = () => new Promise((resolve, reject) => {
	System.findOne({}, (err, doc) => {
		if (err) return reject(err);
		return resolve(doc.heatmapUpdateTime);
	});
});
