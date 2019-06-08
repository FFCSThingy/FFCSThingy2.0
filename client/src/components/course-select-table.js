import React from 'react';
import '../css/course-select-table.css';

class CourseSelect extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var courselist = this.props.courses.map(value => {
			return (
				<tr className="courses" key={value.code} onClick={() => this.props.selectCourse(value.code)}>
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
}




export default CourseSelect;




