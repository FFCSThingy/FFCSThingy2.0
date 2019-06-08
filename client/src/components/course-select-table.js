import React from 'react';
import '../css/course-select-table.css';

const CourseSelect = ({ data }) => {

	var courselist = data.map(value => {
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
				<tr>
					<th className="code-head">Course Code</th>
					<th className="title-head">Course Title</th>
					<th className="title-head">Credits</th>
				</tr>
				{courselist}
			</table>
		</div>
	);
}



export default CourseSelect;




