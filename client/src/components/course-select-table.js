import React from 'react';
import '../css/course-select-table.css';
import axios from 'axios';

class CourseSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: [],
			error: null
		}
	}

	async componentWillMount() {
		axios.get("/course/getCourseList")
			.then(res => {
				if (res.data.success)
					this.setState({ courses: res.data.data })
				else {
					this.setState({ error: res.data.message })
				}
			})
	}

	render() {
		var courselist = this.state.courses.map(value => {
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




