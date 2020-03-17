import React from 'react';

import { Container } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import styles from '../css/SelectedCoursesTable.module.scss';

const sortTimetable = ((a, b) => a.code.localeCompare(b.code));

const SelectedCoursesTableBody = ({ timetable, activeTimetableName, unselectSlot }) => timetable
	.filter((v) => v.timetableName === activeTimetableName)
	.sort(sortTimetable)
	.map((value) => (
		<tr key={value._id}>
			<td>{value.slot}</td>
			<td>{value.code}</td>
			<td>{value.title}</td>
			<td>{value.faculty}</td>
			<td>{value.venue}</td>
			<td>{value.credits}</td>
			<td>
				<FaTrashAlt
					className={styles.trashButton}
					onClick={() => unselectSlot(value)}
				/>
			</td>
		</tr>
	));

const SelectedCoursesTable = ({
	timetable,
	activeTimetableName,
	creditCount,
	unselectSlot,
}) => (
	<Container className={styles.selectedCourseContainer}>
		<table className={styles.selectedCourseTable}>
			<thead className={styles.selectedCourseHead}>
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
			<tbody className={styles.selectedCourseBody}>
				<SelectedCoursesTableBody
					timetable={timetable}
					activeTimetableName={activeTimetableName}
					unselectSlot={unselectSlot}
				/>
			</tbody>
			<tfoot className={styles.creditsRow}>
				<tr>
					<th colSpan="7">
						{`Total Credits: ${creditCount}`}
					</th>
				</tr>
			</tfoot>
		</table>
	</Container>
);

export default SelectedCoursesTable;
