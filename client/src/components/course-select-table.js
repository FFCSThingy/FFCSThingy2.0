import React from 'react';
import '../css/course-select-table.css';
import axios from 'axios';

class CourseSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			courseList: [],
			timestamp: null || localStorage.getItem('courseListTimestamp'),
			error: null
		}
	}

	async componentWillMount() {
		axios.get("/course/getCourseList")
			.then(res => {
				if (res.data.success) {
					if (res.status == 304) {
						var courses = JSON.parse(localStorage.getItem('courseList'));
						this.setState({ courseList: courses });
					} else {
						this.setState({ courseList: res.data.data.courseList });
						localStorage.setItem('courseListTimestamp', res.data.data.timestamp);
						localStorage.setItem('courseList', JSON.stringify(res.data.data.courseList));
					}

				} else
					this.setState({ error: res.data.message })
			});
	}

	render() {
		var courses = this.state.courseList.map(value => {
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
					{courses}
				</table>
			</div>
		);
	}
}




export default CourseSelect;




