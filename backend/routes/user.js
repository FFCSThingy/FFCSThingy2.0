import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

import grades from '../scrapers/userhistory';
import curriculum from '../scrapers/curriculum';


const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));




module.exports = router;