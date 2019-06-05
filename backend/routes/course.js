import express from 'express';

// Utilities
import curriculum from '../utility/curriculumUtility';
import user from '../utility/userUtility';
import course from '../utility/courseUtility';

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));

router.get('/getFullHeatMap', async (req, res, next) => {
	console.log(req.body.timestamp);
	if(!req.body.timestamp)	// TODO: Add timestamp comparison here 
		res.json({ success: true, data: await course.getFullHeatmap() });
	else
		res.status(304).json({ success: true, message: "Up To Date" });	
});

router.get('/getCourseList', async (req, res, next) => {
	try {
		var data = await course.getCourseList();
		res.json({ success: true, data: data });
	} catch(err) {
		res.status(500).json({ success: false, message: '/getCourseList failed' });
	}
});

router.post('/parseCourses', async (req, res, next) => {
	if(req.body.password != "SuckOnDeezNumbNutz")
		res.status(403).json({ success: false, message: "Get the password right, bitchface." });	
});

router.get('/parseCourses', async (req, res, next) => {
	try {
		var parsedData = await course.parseXLSX();
		res.json(parsedData);
	} catch(err) {
		res.status(500).json({ success: false, message: '/parseCourses failed' });
		console.log(err);
	}
});

router.get('/addCoursesToDB', async (req, res, next) => {
	try {
		var courses = await course.parseXLSX();

		var actions = courses.map(course.addCourseToDB);
		var results = Promise.all(actions);

		res.json(await results);

	} catch(err) {
		res.status(500).json({ success: false, message: '/addCoursesToDB failed' });
		console.log(err);
	}
});

router.get('/getCourseByDetails/:code/:type/:faculty/:venue', async (req, res, next) => {
	try {
		var data = {
			code: req.params.code,
			course_type: req.params.type,
			faculty: req.params.faculty,
			venue: req.params.venue
		};

		var doc = await course.getCourseDetails(data)

		if(doc)
			res.json({ success: true, data: doc });
		else
			res.status(404).json({ success: false, message: 'Not found' });
		
	} catch (err) {
		res.status(500).json({ success: false, message: '/getCourseByDetails failed' });
		console.log(err);
	}
});

router.get('/getCourseByID/:id', async (req, res, next) => {
	try {
		var data = {
			_id: req.params.id,
		};

		var doc = await course.getCourseDetails(data)

		if (doc)
			res.json({ success: true, data: doc });
		else
			res.status(404).json({ success: false, message: 'Not found' });
			
	} catch (err) {
		res.status(500).json({ success: false, message: '/getCourseByID failed' });
		console.log(err);
	}
})

module.exports = router;