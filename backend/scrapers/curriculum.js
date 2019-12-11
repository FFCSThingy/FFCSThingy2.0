const cheerio = require('cheerio');
const { logger } = require('../utility/loggers.js');

module.exports.parseCurriculum = (html, userID = '') => new Promise((resolve, reject) => {
	try {
		const $ = cheerio.load(html);

		const courseType = ['pc', 'pe', 'uc', 'ue', 'bridge'];
		const columnHeadings = ['srno', 'code', 'title', 'course_type', 'l', 't', 'p', 'j', 'c'];

		const curr = {};
		let courses = [];
		let course = {};
		const todoCredits = {};

		const page = $.root();

		const credTable = page.find('table').eq(0);
		const credTableTD = credTable.find('td');

		if (userID) {
			curr.reg_prefix = userID.trim().slice(0, 5);
			logger.debug(`Parsing reg_prefix: ${curr.reg_prefix} from user: ${userID}`);
		}

		todoCredits.pc = credTableTD.eq(6).text().trim();
		todoCredits.pe = credTableTD.eq(9).text().trim();
		todoCredits.uc = credTableTD.eq(12).text().trim();
		todoCredits.ue = credTableTD.eq(15).text().trim();
		curr.todoCredits = todoCredits;

		const pageBody = page.find('tbody');
		const bodyTableCount = pageBody.length;

		for (let i = 1; i < bodyTableCount; i += 1) {
			courses = [];
			const tr = pageBody.eq(i).find('tr');
			const tableTRCount = tr.length;

			for (let j = 0; j < tableTRCount; j += 1) {
				course = {};
				const td = tr.eq(j).find('td');
				const rowTDCount = td.length;

				for (let k = 0; k < rowTDCount; k += 1) {
					let text = td.eq(k).text().trim();
					text = text.replace(/\W{2,}/, ' ').trim();
					if (columnHeadings[k] === 'code') { text = text.substr(0, 7); }
					course[columnHeadings[k]] = text;
				}

				courses.push(course);
			}

			curr[courseType[i - 1]] = courses;
		}


		return resolve(curr);
	} catch (ex) {
		logger.error(`Error in parsing Curriculum for ${userID}: ${ex}`);
		return reject(ex);
	}
});
