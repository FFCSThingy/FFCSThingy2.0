import React, { memo, FC } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import styles from '../css/TimetableCell.module.scss';

interface TimetableCellProps {
	isFilled: boolean;
	isLab: boolean;
	dayHeader: boolean;
	timeHeader: boolean;
	isBreak: boolean;
	reqdCourse: {
		title: string;
		faculty: string;
		slot: string;
		code: string;
		venue: string;
		course_type: string;
	};
	children: string;
}

const TimetableCell: FC<TimetableCellProps> = memo(
	({
		isFilled, isLab, dayHeader, timeHeader, isBreak, reqdCourse, children,
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
			<Tooltip id={children}>
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
		<td key={children} className={styles.empty}>{children}</td>
	);
});

export default TimetableCell;
