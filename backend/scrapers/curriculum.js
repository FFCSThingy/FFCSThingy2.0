const cheerio = require('cheerio');
const Promise = require('bluebird');
const moment = require('moment');

module.exports.parseCurriculum = (html) => {
	return new Promise((resolve, reject) => {
		try {
			const $ = cheerio.load(html);

			var course_type = ['pc', 'pe', 'uc', 'ue', 'bridge'];
			var col_headings = ['srno', 'code', 'title', 'course_type', 'l', 't', 'p', 'j', 'c'];

			var curr = {};
			var courses = [];
			var course = {};
			var todoCreds = {};

			var page = $.root();
			var credTable = page.find('table').eq(0);

			var td = credTable.find('td');
			todoCreds['pc'] = td.eq(6).text().trim();
			todoCreds['pe'] = td.eq(9).text().trim();
			todoCreds['uc'] = td.eq(12).text().trim();
			todoCreds['ue'] = td.eq(15).text().trim();
			console.log(todoCreds);
			curr['todoCreds'] = todoCreds;

			var table = page.find("tbody");
			var table_count = table.length;
			
			for (var i = 1; i < table_count; i++) {
				courses = [];
				var tr = table.eq(i).find("tr.odd");
				var tr_count = tr.length;

				for (var j = 0; j < tr_count; j++) {
					course = {};
					var td = tr.eq(j).find("td");
					var td_count = td.length;

					for (var k = 0; k < td_count; k++) {
						var text = td.eq(k).text().trim();
						text = text.replace(/\W{2,}/, ' ').trim();
						if(col_headings[k] == 'code') 
							text = text.substr(0, 7);
						course[col_headings[k]] = text;
					}

					courses.push(course);
				}

				curr[course_type[i - 1]] = courses;
			}


			return resolve(curr);
		} catch (ex) {
			console.log(ex);
			return reject(ex);
		}
	});
}