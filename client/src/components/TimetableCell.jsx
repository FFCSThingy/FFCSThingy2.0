import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import styles from '../css/TimetableCell.module.scss';

const TimetableCell = ({
	isFilled, isLab, dayHeader, timeHeader, isBreak, children, reqdCourse,
}) => {
	if (isBreak) {
		return (
			<th key={children} rowSpan={9} className={styles.break}>{children}</th>
		);
	}
	if (timeHeader) {
		return (
			<td key={children} className={styles.timeHeader}>
				{children}
			</td>
		);
	}
	if (dayHeader) {
		return (
			<th key={children} className={styles.dayHeader}>{children}</th>
		);
	}
	if (isFilled) {
		const cellClass = (isLab) ? styles.filledLab : styles.filledTheory;
		const tooltip = (
			<Tooltip>
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
			<td key={children} className={cellClass}>
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
		<td key={children} className={styles.empty}>{children}</td>
	);
};


TimetableCell.defaultProps = {
	filled: false,
	lab: false,
	day: false,
	time: false,
	slotString: '',
};

export default TimetableCell;
