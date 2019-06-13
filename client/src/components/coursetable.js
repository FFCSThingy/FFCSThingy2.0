import React from 'react';

import { Table, Container } from 'react-bootstrap';

import '../css/courseTable.css';

class CourseTable extends React.Component {
	
	render() {
		var { timetable } = this.props;
		var appendList = timetable.map(value => {
			return (
				<tr key={value._id}>
					<td>{value.slot}</td>
					<td>{value.code}</td>
					<td>{value.title}</td>
					<td>{value.faculty}</td>
					<td>{value.venue}</td>
					<td>{value.credits}</td>
					<td></td>
				</tr>
			)
		});
		
		return (
			<Container className="selectedCourseContainer">
				<Table className="selectedCourseTable" responsive>
					<thead className="selectedCourseHead">
						<tr>
							<th>Slot</th>
							<th>Code</th>
							<th>Title</th>
							<th>Faculty</th>
							<th>Venue</th>
							<th>Credits</th>
							<th></th>
						</tr>
					</thead>
					<tbody className="selectedCourseBody">
						{appendList}
						<tr>
							<td colSpan="7" className="creditsRow">
								<strong>Total Credits: { this.props.creditCount }</strong>
							</td>
						</tr>
					</tbody>
				</Table>
			</Container>

		)
	}
}

export default CourseTable;