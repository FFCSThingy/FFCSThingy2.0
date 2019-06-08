const mongoose = require("mongoose");

var systemSchema = mongoose.Schema({	// From the data given in the sheet
	courseRepopulateTime: Date,
	heatmapUpdateTime: Date,
	
});

module.exports = mongoose.model("System", systemSchema);