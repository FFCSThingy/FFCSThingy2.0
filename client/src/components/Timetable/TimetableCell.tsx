import React, { memo, FC } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import styles from '../../css/TimetableCell.module.scss';

import TimetableCellProps from '../../models/components/Timetable/TimetableCell';

const TimetableCell: FC<TimetableCellProps> = memo(
	({
		isFilled=false, isLab=false, dayHeader=false, timeHeader=false, isBreak=false, reqdCourse={}, children=<></>, defaultValue=''
	}
) => {
	if (isBreak) {
		return (
			<th
				rowSpan={9} 
				className={styles.break}
			>
				{children}
			</th>
		);
	}
	if (timeHeader) {
		return (
			<td className={styles.timeHeader}>
				{children}
			</td>
		);
	}
	if (dayHeader) {
		return (
			<th className={styles.dayHeader}>{children}</th>
		);
	}
	if (isFilled) {
		const cellClass = (isLab) ? styles.filledLab : styles.filledTheory;
		const tooltip = (
			<Tooltip id={defaultValue}>
				<h6 className={styles.courseDetails}>
					<b>{reqdCourse.title}</b>
					<br />
					{reqdCourse.faculty}
					<br />
					{reqdCourse.slot}
				</h6>
			</Tooltip>
		);

		return (
			<td className={cellClass}>
				<OverlayTrigger
					key={`${children}-Overlay`}
					placement="top"
					trigger={['hover', 'click']}
					overlay={tooltip}
				>
					<div>
						<b className={styles.slotDetails}>{children}</b>
						<h6 className={styles.courseCode}>{reqdCourse.code}</h6>
						<h6 className={styles.courseDetails}>
							{`${reqdCourse.venue} - ${reqdCourse.course_type}`}
						</h6>
					</div>
				</OverlayTrigger>
			</td>
		);
	}

	return (
		<td className={styles.empty}>{children}</td>
	);
});

export default TimetableCell;
