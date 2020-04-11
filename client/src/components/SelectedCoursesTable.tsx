import React, { FC } from 'react';

import { Container } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import styles from '../css/SelectedCoursesTable.module.scss';

import TimetableData from '../models/TimetableData';

const sortTimetable = ((a: TimetableData, b: TimetableData) => a.code.localeCompare(b.code));

interface SelectedCoursesTable {
	timetable: TimetableData[];
	activeTimetableName: string;
	creditCount: number;
	unselectSlot: Function;
}

const SelectedCoursesTable: FC<SelectedCoursesTable> = (
	{
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
					{
						timetable
							.filter((v: TimetableData) => v.timetableName === activeTimetableName)
							.sort(sortTimetable)
							.map((value: TimetableData) => (
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
							))
					}
				</tbody>

				<tfoot className={styles.creditsRow}>
					<tr>
						<th colSpan={7}>
							{`Total Credits: ${creditCount}`}
						</th>
					</tr>
				</tfoot>
			</table>
		</Container>
	);

export default SelectedCoursesTable;
