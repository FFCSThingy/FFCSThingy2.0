const cheerio = require('cheerio');
const Promise = require('bluebird');

module.exports.parseUserHistory = (html) => {
	var data = {
		"courses": [],
		"user": {},
		"grades": {},
		"summary": {},
	};
	return new Promise((resolve, reject) => {
		try {

			//User Data Scraper
			var $ = cheerio.load(html);
			var user_headings = ['reg_no', 'name', 'Programme and Branch', 'mode', 'system', 'gender', 'joined_yr', 'edu_status', 'school', 'campus'];
			var grades = ['creds_reg', 'creds_earned', 'cgpa', 's', 'a', 'b', 'c', 'd', 'e', 'f', 'n'];

			var tr = $('tr');
			var row = tr.eq(1);
			var td = row.find('td');

			for (var i = 0; i < td.length; i++) {
				if (i == 3 || i == 4 || i == 7)
					continue;
				if (i == 2) {
					var str = td.eq(i).text().split(" - ");
					data["user"]["programme"] = str[0];
					data["user"]["branch"] = str[1];
				}
				else
					data["user"][user_headings[i]] = td.eq(i).text();

			}


			const baseScraper = cheerio.load(html);
			const gradesScraper = cheerio.load(baseScraper('table.customTable').eq(0).html());
			const trCount = baseScraper('tr.tableContent').length;
			console.log(trCount);

			baseScraper('tr.tableContent').each((i, elem) => {
				if (i <= 0) {
					return;
				} 

				const attrs = baseScraper(elem).children('td');

				if(i == trCount - 1) {
					for(var j = 0; j < grades.length; j++)
						data.grades[grades[j]] = attrs.eq(j).text().trim();
					return;	
				}

				switch(i) {
					case trCount - 10: 
						data.summary.pc_reqd = attrs.eq(1).text().trim();
						data.summary.pc_earned = attrs.eq(2).text().trim();
						return;

					case trCount - 9:
						data.summary.uc_reqd = attrs.eq(1).text().trim();
						data.summary.uc_earned = attrs.eq(2).text().trim();
						return;

					case trCount - 8:
						data.summary.pe_reqd = attrs.eq(1).text().trim();
						data.summary.pe_earned = attrs.eq(2).text().trim();
						return;

					case trCount - 7:
						data.summary.ue_reqd = attrs.eq(1).text().trim();
						data.summary.ue_earned = attrs.eq(2).text().trim();
						return;

					case trCount - 6:
						data.summary.bridge_reqd = attrs.eq(1).text().trim();
						data.summary.bridge_earned = attrs.eq(2).text().trim();
						return;

					case trCount - 5:
						data.summary.total_reqd = attrs.eq(1).text().trim();
						data.summary.total_earned = attrs.eq(2).text().trim();
						return;

					case trCount - 4:
						data.summary.sts_distib = attrs.eq(1).text().trim();
						data.summary.sts_reqd = attrs.eq(2).text().trim();
						data.summary.sts_earned = attrs.eq(3).text().trim();
						return;

					case trCount - 3:
						data.summary.exc_distib = attrs.eq(1).text().trim();
						data.summary.exc_reqd = attrs.eq(2).text().trim();
						data.summary.exc_earned = attrs.eq(3).text().trim();
						return;

					case trCount - 2:
						data.summary.lang_distib = attrs.eq(1).text().trim();
						data.summary.lang_reqd = attrs.eq(2).text().trim();
						data.summary.lang_earned = attrs.eq(3).text().trim();
						return;
				}

				if (attrs.eq(4).text().trim() == '') return;

				var course = {
					'code': attrs.eq(1).text().trim(),
					'title': attrs.eq(2).text().trim(),
					'course_type': attrs.eq(3).text(),
					'credits': attrs.eq(4).text().trim(),
					'grade': attrs.eq(5).text().trim(),
				};
				// console.log(course);
				data.courses.push(course);

				data["courses"] = data["courses"].filter((course) => course["credits"] != null && !isNaN(course["credits"]));

			});

			return resolve(data);
		}
		catch (ex) {
			console.log(ex);
			return reject(ex);
		}
	});
}