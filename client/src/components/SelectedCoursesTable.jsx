import React from 'react';

import { Container } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import '../css/SelectedCoursesTable.css';

class SelectedCoursesTable extends React.Component {
	sortTimetable = ((a, b) => a.code.localeCompare(b.code));

	render() {
		const timetable = this.props.timetable.filter((v) => v.timetableName === this.props.activeTimetable);
		const appendList = timetable.sort(this.sortTimetable).map((value) => (
			<tr key={value._id}>
				<td>{value.slot}</td>
				<td>{value.code}</td>
				<td>{value.title}</td>
				<td>{value.faculty}</td>
				<td>{value.venue}</td>
				<td>{value.credits}</td>
				<td>
					<FaTrashAlt className="trashButton" onClick={() => this.props.unselectSlot(value)} />

				</td>
			</tr>
		));

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
							<th> </th>
						</tr>
					</thead>
					<tbody className="selectedCourseBody">
						{appendList}
					</tbody>
					<tfoot className="creditsRow">
						<tr>
							<td colSpan="7">
								<strong>
									{`Total Credits: ${this.props.creditCount}`}
								</strong>
							</td>
						</tr>
					</tfoot>
				</table>
			</Container>

		);
	}
}

export default SelectedCoursesTable;
