const cheerio = require('cheerio');
const { logger } = require('../utility/loggers.js');

module.exports.parseUserHistory = (html, userID = '') => {
	const data = {
		completed_courses: [],
		grades: {},
		credit_summary: {},
	};

	return new Promise((resolve, reject) => {
		try {
			// User Data Scraper
			const $ = cheerio.load(html);
			const userDataHeadings = ['reg_no', 'name', 'Programme and Branch', 'mode', 'system', 'gender', 'joined_yr', 'edu_status', 'school', 'campus'];
			const gradeTableHeadings = ['creds_reg', 'creds_earned', 'cgpa', 's', 'a', 'b', 'c', 'd', 'e', 'f', 'n'];

			const tr = $('tr');
			const row = tr.eq(1);
			const td = row.find('td');

			for (let i = 0; i < td.length; i += 1) {
				// eslint-disable-next-line no-continue
				if (i === 3 || i === 4 || i === 7) { continue; }
				if (i === 2) {
					const str = td.eq(i).text().split(' - ');
					[data.programme, data.branch] = str;
				} else { data[userDataHeadings[i]] = td.eq(i).text(); }
			}

			let diff = 0;	// For 16* Peeps who have an extra row in their thingy.

			const baseScraper = cheerio.load(html);
			const baseScraper2 = cheerio.load(html);
			const trCount = baseScraper('tr.tableContent').length;

			if (userID) {
				if (userID.trim().startsWith('16')) { diff = 1; }
			}

			try {
				const check = baseScraper2(baseScraper2('tr.tableContent')[trCount - 5]).children('td').eq(1).text()
					.trim();
				if (check === 'UC') diff = 1;
				if (check === '-') diff = -1;
			} catch (e) {
				logger.error(`userhistory error in check: ${e} for ${userID}`);
			}


			baseScraper('tr.tableContent').each((i, elem) => {
				if (i <= 0) {
					return;
				}

				const attrs = baseScraper(elem).children('td');

				if (i === trCount - 1) {
					for (let j = 0; j < gradeTableHeadings.length; j += 1) {
						data.grades[gradeTableHeadings[j]] = attrs.eq(j).text().trim();
					}
					return;
				}
				const courseRegex = /^\w{3}\d{4}$/;
				if (!attrs.eq(1).text().match(courseRegex)) {
					return;
				}

				// console.log(i, attrs.eq(1).text(), attrs.eq(2).text());

				switch (i) {
					case trCount - (10 + diff):
						data.credit_summary.pc_reqd = attrs.eq(1).text().trim();
						data.credit_summary.pc_earned = attrs.eq(2).text().trim();
						return;

					case trCount - (9 + diff):
						data.credit_summary.uc_reqd = attrs.eq(1).text().trim();
						data.credit_summary.uc_earned = attrs.eq(2).text().trim();
						return;

					case trCount - (8 + diff):
						data.credit_summary.pe_reqd = attrs.eq(1).text().trim();
						data.credit_summary.pe_earned = attrs.eq(2).text().trim();
						return;

					case trCount - (7 + diff):
						data.credit_summary.ue_reqd = attrs.eq(1).text().trim();
						data.credit_summary.ue_earned = attrs.eq(2).text().trim();
						return;

					case trCount - (6 + diff):
						data.credit_summary.bridge_reqd = attrs.eq(1).text().trim();
						if (data.credit_summary.bridge_reqd === '-') {
							data.credit_summary.bridge_reqd = '0';
						}
						data.credit_summary.bridge_earned = attrs.eq(2).text().trim();
						return;

					case trCount - (5 + diff):
						data.credit_summary.total_reqd = attrs.eq(1).text().trim();
						data.credit_summary.total_earned = attrs.eq(2).text().trim();
						return;

					case trCount - (4 + diff):
						if (diff === 1) {
							data.credit_summary.biochem_distib = attrs.eq(1).text().trim();
							data.credit_summary.biochem_reqd = attrs.eq(2).text().trim();
							data.credit_summary.biochem_earned = attrs.eq(3).text().trim();
						}

					// eslint-disable-next-line no-fallthrough
					case trCount - 4:
						data.credit_summary.sts_distib = attrs.eq(1).text().trim();
						data.credit_summary.sts_reqd = attrs.eq(2).text().trim();
						data.credit_summary.sts_earned = attrs.eq(3).text().trim();
						return;

					case trCount - 3:
						data.credit_summary.exc_distib = attrs.eq(1).text().trim();
						data.credit_summary.exc_reqd = attrs.eq(2).text().trim();
						data.credit_summary.exc_earned = attrs.eq(3).text().trim();
						return;

					case trCount - 2:
						data.credit_summary.lang_distib = attrs.eq(1).text().trim();
						data.credit_summary.lang_reqd = attrs.eq(2).text().trim();
						data.credit_summary.lang_earned = attrs.eq(3).text().trim();
						return;

					// eslint-disable-next-line no-extra-semi
					default: ;
				}

				if (attrs.eq(4).text().trim() === '') return;

				const course = {
					code: attrs.eq(1).text().trim(),
					title: attrs.eq(2).text().trim(),
					course_type: attrs.eq(3).text(),
					credits: attrs.eq(4).text().trim(),
					grade: attrs.eq(5).text().trim(),
				};

				data.completed_courses.push(course);

				data.completed_courses = data.completed_courses.filter(
					// eslint-disable-next-line no-restricted-globals
					(c) => c.credits != null && !isNaN(c.credits),
				);
			});

			return resolve(data);
		} catch (ex) {
			logger.error(`Error in parsing userhistory for ${userID}: ${ex}`);
			return reject(ex);
		}
	});
};
