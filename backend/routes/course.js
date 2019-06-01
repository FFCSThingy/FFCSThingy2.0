import express from 'express';

// Utilities
import curriculum from '../utility/curriculumUtility';
import user from '../utility/userUtility';
import course from '../utility/courseUtility';

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));



module.exports = router;