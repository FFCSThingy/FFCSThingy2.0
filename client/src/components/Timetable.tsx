import React, { memo, FC } from 'react';
import MediaQuery from 'react-responsive';
import { Container } from 'react-bootstrap';
import { FaSun } from 'react-icons/fa';

import TimetableCell from './TimetableCell';

import { SLOTS, HEADERS } from '../constants/Timetable';

import TimetableCourse from '../models/TimetableCourse';

import styles from '../css/Timetable.module.scss';

interface TimetableHeaderRow {
	isMobile?: boolean;
	isAfternoon?: boolean;
	rowNumber: number;
}

const TimetableHeaderRow: FC<TimetableHeaderRow> = memo(
	({ isMobile, isAfternoon, rowNumber }) => {
		const rowCells = HEADERS[rowNumber].map((val, i) => {
			// To split with a <br> between words
			// Adds <br> only if acc exists
			const cellVal = val.split(' ').reduce((acc, v) => (
				<>
					{acc}
					{acc ? (<br />) : ''}
					{v}
				</>
			), <></>);

			// First cells ("Theory Hours", "Lab Hours")
			if (i === 0) {
				return (
					<TimetableCell
						key={`TimetableHeaderCell-${val}`}
						defaultValue={val}
						dayHeader
					>
						{cellVal}
					</TimetableCell>
				);
			}

			if (isMobile) {
				// Only need first 7 cells for morning
				if (!isAfternoon && i > 6) return null;

				// Only need cells after 8 for evening row1 (Because break cell)
				if (isAfternoon && rowNumber === 0 && i < 8) return null;

				// Only need cells after 7 for evening row2
				if (isAfternoon && i < 7) return null;
			} else if (rowNumber === 0 && i === 7) { // Break Cell
				return (
					<TimetableCell
						key={`TimetableBreakCell-${val}`}
						defaultValue={val}
						isBreak
					>
						{cellVal}
					</TimetableCell>
				);
			}

			// Default Header Cell
			return (
				<TimetableCell
					key={`TimetableHeaderCell-${val}`}
					defaultValue={val}
					timeHeader
				>
					{cellVal}
				</TimetableCell>
			);
		});

		let rowClassName = (rowNumber === 0) ? 'timetableHeader1' : 'timetableHeader2';
		if (isMobile && !isAfternoon) rowClassName = `${rowClassName}A`;
		if (isMobile && isAfternoon) rowClassName = `${rowClassName}B`;

		return (
			<tr className={styles[rowClassName]}>
				{rowCells}
			</tr>
		);
	}
);

interface TimetableHeader {
	isMobile?: boolean;
	isAfternoon?: boolean;
}

const TimetableHeader: FC<TimetableHeader> = memo(
	({ isMobile, isAfternoon }) => (
		<thead>
			<TimetableHeaderRow
				isMobile={!!isMobile}
				isAfternoon={!!isAfternoon}
				rowNumber={0}
				key="TimetableHeaderRow-0"
			/>
			<TimetableHeaderRow
				isMobile={!!isMobile}
				isAfternoon={!!isAfternoon}
				rowNumber={1}
				key="TimetableHeaderRow-1"
			/>
		</thead>
	)
);

interface TimetableBodyRow {
	timetable: TimetableCourse[];
	rowNumber: number;
	isMobile?: boolean;
	isAfternoon?: boolean;
	filledSlots: string[];
	activeTimetableName: string;
}

const TimetableBodyRow: FC<TimetableBodyRow> = memo(
	({
		isMobile,
		isAfternoon,
		rowNumber,
		filledSlots,
		timetable,
		activeTimetableName,
	}) => {
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
			if (!isMobile && rowNumber === 0 && i === 7) {
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
			if (isMobile && rowNumber === 0 && i === 7) return null;

			// Dont need cols after 5 for morning
			if (isMobile && !isAfternoon && i > 6) return null;

			// Dont need cols before 7 (6 is break) for afternoon
			if (isMobile && isAfternoon && i < 7) return null;

			// Splits slot string to find lab and theory slot of the given cell
			const currentCellSlots = slotVal.split('/');
			const [theorySlot, labSlot] = currentCellSlots;

			// Checks timetable to find the selected lab course for this cell
			const reqdLabCourse = filledSlots.includes(labSlot)
				&& timetable.find((course) => (
					course.slot.replace(' ', '').split('+').includes(labSlot)
					&& course.timetableName === activeTimetableName
				));

			// Checks timetable to find the selected theory course for this cell
			const reqdTheoryCourse = filledSlots.includes(theorySlot)
				&& timetable.find((course) => (
					course.slot.replace(' ', '').split('+').includes(theorySlot)
					&& course.timetableName === activeTimetableName
				));

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
	}
);

interface TimetableBody {
	timetable: TimetableCourse[];
	isMobile?: boolean;
	isAfternoon?: boolean;
	filledSlots: string[];
	activeTimetableName: string;
}

const TimetableBody: FC<TimetableBody> = memo(
	({
		isMobile,
		isAfternoon,
		filledSlots,
		timetable,
		activeTimetableName,
	}) => {
		const bodyRows = SLOTS.map((v, i) => (
			<TimetableBodyRow
				isMobile={isMobile}
				isAfternoon={isAfternoon}
				rowNumber={i}
				key={`TimetableBodyRow-${v[0]}`}

				filledSlots={filledSlots}
				timetable={timetable}
				activeTimetableName={activeTimetableName}
			/>
		));
		return (
			<tbody className={styles.timetableBody}>
				{bodyRows}
			</tbody>
		);
	}
);

interface Timetable {
	timetable: TimetableCourse[];
	activeTimetableName: string;
	filledSlots: string[];
};

const MobileTimetable: FC<Timetable> = memo(
	({ timetable, activeTimetableName, filledSlots }) => (
		<Container className={styles.timetableContainer}>
			<FaSun className={styles.morningIcon} size="2x" color="yellow" />
			<table className={styles.timetableA}>
				<TimetableHeader isMobile />
				<TimetableBody
					isMobile

					timetable={timetable}
					activeTimetableName={activeTimetableName}
					filledSlots={filledSlots}
				/>
			</table>

			<FaSun className={styles.eveningIcon} size="2x" />
			<table className={styles.timetableB}>
				<TimetableHeader isMobile isAfternoon />
				<TimetableBody
					isMobile
					isAfternoon

					timetable={timetable}
					activeTimetableName={activeTimetableName}
					filledSlots={filledSlots}
				/>
			</table>
		</Container>
	)
);

const DesktopTimetable: FC<Timetable> = memo(
	({ timetable, activeTimetableName, filledSlots }) => (
		<Container className={styles.timetableContainer} fluid>
			<table className={styles.timetable}>
				<TimetableHeader />
				<TimetableBody
					timetable={timetable}
					activeTimetableName={activeTimetableName}
					filledSlots={filledSlots}
				/>
			</table>
		</Container>
	)
);

const Timetable: FC<Timetable> = memo(
	({ timetable, activeTimetableName, filledSlots }) => (
		// Media Query for phones
		<MediaQuery minDeviceWidth={768}>
			{(matches) => {
				if (matches) {
					return (
						<DesktopTimetable
							timetable={timetable}
							activeTimetableName={activeTimetableName}
							filledSlots={filledSlots}
						/>
					);
				}
				return (
					<MobileTimetable
						timetable={timetable}
						activeTimetableName={activeTimetableName}
						filledSlots={filledSlots}
					/>
				);
			}}
		</MediaQuery>
	)
);

export default Timetable;
