import express from 'express';

// Utilities
import curriculum from '../utility/curriculumUtility';
import user from '../utility/userUtility';
import course from '../utility/courseUtility';

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));

router.post('/getFullHeatMap', async (req, res, next) => {
	console.log(req.body.timestamp);
	if(!req.body.timestamp)	// TODO: Add timestamp comparison here 
		res.json({ success: true, data: await course.getFullHeatmap() });
	else
		res.status(304).json({ success: true, message: "Up To Date" });	
});

module.exports = router;