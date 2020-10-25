import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';

import TimetableCell from './TimetableCell';

import { SLOTS, breakPosition } from '../../constants/Timetable';

import styles from '../../css/Timetable.module.scss';

import {
	selectFilteredTimetable,
	selectFilledSlots,
} from '../../selectors/timetable';

import TimetableBodyProps, { TimetableBodyRowProps } from '../../models/components/Timetable/TimetableBody';

const TimetableBodyRow: FC<TimetableBodyRowProps> = memo(
	({
		isMobile,
		isAfternoon,
		rowNumber,
	}) => {
		const timetable = useSelector(selectFilteredTimetable);
		const filledSlots = useSelector(selectFilledSlots);

		const rowCells = SLOTS[rowNumber].map((slotVal, i) => {
			let slotString = slotVal;

			// Day Header Cells
			if (i === 0) {
				return (
					<TimetableCell
						key={`TimetableHeaderCell-${slotString}`}
						defaultValue={slotString}
						dayHeader
					>
						{slotString}
					</TimetableCell>
				);
			}

			// Break Cell for desktop
			if (!isMobile && rowNumber === 0 && i === breakPosition) {
				return (
					<TimetableCell
						key={`TimetableBreakCell-${slotString}`}
						defaultValue={slotString}
						isBreak
					>
						{slotString}
					</TimetableCell>
				);
			}

			// Break not needed
			if (isMobile && rowNumber === 0 && i === breakPosition) return null;

			// Dont need cols after 5 for morning
			if (isMobile && !isAfternoon && i >= breakPosition) return null;

			// Dont need cols before 7 (6 is break) for afternoon
			if (isMobile && isAfternoon && i < breakPosition) return null;

			// Splits slot string to find lab and theory slot of the given cell
			const currentCellSlots = slotVal.split('/');
			const [theorySlot, labSlot] = currentCellSlots;

			// Checks timetable to find the selected lab course for this cell
			const reqdLabCourse = filledSlots.includes(labSlot)
				&& timetable.find((course) => course.slot
					.replace(' ', '').split('+').includes(labSlot));

			// Checks timetable to find the selected theory course for this cell
			const reqdTheoryCourse = filledSlots.includes(theorySlot)
				&& timetable.find((course) => course.slot
					.replace(' ', '').split('+').includes(theorySlot));

			// For Slots with only one component (L6, L12, EXTM, L24, L30)
			if (!labSlot) slotString = theorySlot;
			else if (!theorySlot) slotString = labSlot;

			// Is a theory slot
			if (reqdTheoryCourse) {
				return (
					<TimetableCell
						reqdCourse={reqdTheoryCourse}
						key={`TimetableBodyCell-${slotString}`}
						defaultValue={slotString}
						isFilled
					>
						{slotString}
					</TimetableCell>
				);
			}

			// Is a lab slot
			if (reqdLabCourse) {
				return (
					<TimetableCell
						reqdCourse={reqdLabCourse}
						key={`TimetableBodyCell-${slotString}`}
						defaultValue={slotString}
						isFilled
						isLab
					>
						{slotString}
					</TimetableCell>
				);
			}

			// Default cell
			return (
				<TimetableCell
					key={`TimetableBodyCell-${slotString}`}
					defaultValue={slotString}
				>
					{slotString}
				</TimetableCell>
			);
		});

		return (
			<tr className={styles.timetableBodyRow}>
				{rowCells}
			</tr>
		);
	},
);

const TimetableBody: FC<TimetableBodyProps> = memo(
	({
		isMobile,
		isAfternoon,
	}) => {
		const bodyRows = SLOTS.map((v, i) => (
			<TimetableBodyRow
				isMobile={isMobile}
				isAfternoon={isAfternoon}
				rowNumber={i}
				key={`TimetableBodyRow-${v[0]}`}
			/>
		));
		return (
			<tbody className={styles.timetableBody}>
				{bodyRows}
			</tbody>
		);
	},
);

export default TimetableBody;
