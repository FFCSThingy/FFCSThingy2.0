import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Container } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import styles from '../../css/SelectedCoursesTable.module.scss';

import { removeCourse } from '../../reducers/timetable';
import {
	selectFilteredTimetable,
	selectCreditCount,
} from '../../selectors/timetable';

import TimetableCourse from '../../models/data/TimetableCourse';
import { selectCurrentCurriculumData } from '../../selectors/curriculum';

const sortTimetable = (
	(a: TimetableCourse, b: TimetableCourse) => a.code.localeCompare(b.code));

const SelectedCoursesTable = () => {
	const dispatch = useDispatch();
	const timetable = useSelector(selectFilteredTimetable);
	const creditCount = useSelector(selectCreditCount);
	const selectedCurriculum = useSelector(selectCurrentCurriculumData);

	return (
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
						<th>Category</th>
						<th> </th>
					</tr>
				</thead>

				<tbody className={styles.selectedCourseBody}>
					{
						timetable
							.slice() // To make a copy, avoid TypeError
							.sort(sortTimetable)
							.map((value: TimetableCourse) => {
								let category = '-';
								if (selectedCurriculum.uc.find((v) => v.code === value.code)) {
									category = 'UC';
								} else if (selectedCurriculum.pc.find((v) => v.code === value.code)) {
									category = 'PC';
								} else if (selectedCurriculum.pe.find((v) => v.code === value.code)) {
									category = 'PE';
								} else if (selectedCurriculum.ue.find((v) => v.code === value.code)) {
									category = 'UE';
								}

								return (
									<tr key={value._id}>
										<td>{value.slot}</td>
										<td>{value.code}</td>
										<td>{value.title}</td>
										<td>{value.faculty}</td>
										<td>{value.venue}</td>
										<td>{value.credits}</td>
										<td>{category}</td>
										<td>
											<FaTrashAlt
												className={styles.trashButton}
												onClick={
													() => dispatch(removeCourse({
														course: value,
														timeEpoch: Date.now(),
													}))
												}
											/>
										</td>
									</tr>
								);
							})
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
};

export default SelectedCoursesTable;
