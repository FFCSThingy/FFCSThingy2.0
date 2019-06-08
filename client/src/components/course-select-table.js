import React from 'react';
import '../css/course-select-table.css';

const Course = ({ data }) => {

	var tableHeaders = data.slice(0, 1).map(value => {
		return (
			<tr>
				<th className="code-head">Course Code</th>
				<th className="title-head">Course Title</th>
				<th className="title-head">Credits</th>
			</tr>
		)
	})

	var courselist = data.slice(1).map(value => {
		return (
			<tr className="courses" key={value.key}>
				<td className="course-code">{value.code}</td>
				<td className="course-title">{value.title}</td>
				<td className="course-title">{value.credits}</td>
			</tr>

		)
	})

	return (
		<div className="courselist">
			<table className="courseTable" >
				{tableHeaders}
				{courselist}
			</table>
		</div>
	);
}



export default Course;




