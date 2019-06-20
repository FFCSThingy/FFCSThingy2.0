import React from 'react';

import { Container, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import '../css/courseTable.css';

class CourseTable extends React.Component {
	
	sortTimetable = ((a, b) => {
		return a.code.localeCompare(b.code)	
	});

	render() {
		var timetable = this.props.timetable.filter(v => v.timetableName === this.props.activeTimetable)
		var appendList = timetable.sort(this.sortTimetable).map(value => {
			return (
				<tr key={value._id}>
					<td>{value.slot}</td>
					<td>{value.code}</td>
					<td>{value.title}</td>
					<td>{value.faculty}</td>
					<td>{value.venue}</td>
					<td>{value.credits}</td>
					<td>
						<FaTrash className="trashButton" onClick={() => this.props.unselectSlot(value)}>
						</FaTrash>
						
					</td>
				</tr>
			)
		});
		
		return (
			<Container className="selectedCourseContainer">
				<table className="selectedCourseTable">
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
				</table>
			</Container>

		)
	}
}

export default CourseTable;