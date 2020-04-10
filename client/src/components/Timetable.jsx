import React, { memo } from 'react';
import MediaQuery from 'react-responsive';
import { Container } from 'react-bootstrap';
import { FaSun } from 'react-icons/fa';

import TimetableCell from './TimetableCell.tsx';

import { SLOTS, HEADERS } from '../constants/Timetable';

import styles from '../css/Timetable.module.scss';

const TimetableHeaderRow = memo(({ isMobile, isAfternoon, rowNumber }) => {
	const rowCells = HEADERS[rowNumber].map((val, i) => {
		const cellVal = val.split(' ').reduce((acc, v) => (acc === null
			? <>{v}</>
			: (
				<>
					{acc}
					<br />
					{v}
				</>
			)), null);

		if (i === 0) return <TimetableCell key={`TimetableHeaderCell-${val}`} dayHeader>{cellVal}</TimetableCell>;

		if (isMobile) {
			if (!isAfternoon && i > 6) return null;	// Only need first 7 cells for morning
			if (isAfternoon && rowNumber === 0 && i < 8) return null;	// Only need cells after 8 for evening row1 (Because break cell)
			if (isAfternoon && i < 7) return null;	// Only need cells after 7 for evening row2
		} else if (rowNumber === 0 && i === 7) return <TimetableCell key={`TimetableBreakCell-${val}`} isBreak>{cellVal}</TimetableCell>;

		return <TimetableCell key={`TimetableHeaderCell-${val}`} timeHeader>{cellVal}</TimetableCell>;
	});

	let rowClassName = (rowNumber === 0) ? 'timetableHeader1' : 'timetableHeader2';
	if (isMobile && !isAfternoon) rowClassName = `${rowClassName}A`;
	if (isMobile && isAfternoon) rowClassName = `${rowClassName}B`;

	return (
		<tr className={styles[rowClassName]}>
			{rowCells}
		</tr>
	);
});

const TimetableHeader = memo(({ isMobile, isAfternoon }) => (
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
));

const TimetableBodyRow = memo(({
	isMobile,
	isAfternoon,
	rowNumber,
	filledSlots,
	timetable,
	activeTimetableName,
}) => {
	const rowCells = SLOTS[rowNumber].map((slotVal, i) => {
		let slotString = slotVal;

		if (i === 0) return <TimetableCell key={`TimetableHeaderCell-${slotString}`} dayHeader>{slotString}</TimetableCell>;

		if (!isMobile && rowNumber === 0 && i === 7) {
			return <TimetableCell key={`TimetableBreakCell-${slotString}`} isBreak>{slotString}</TimetableCell>;
		}
		if (isMobile && rowNumber === 0 && i === 7) return null;

		if (isMobile && !isAfternoon && i > 6) return null;
		if (isMobile && isAfternoon && i < 7) return null;

		const currentCellSlots = slotVal.split('/');
		const [theorySlot, labSlot] = currentCellSlots;

		const reqdLabCourse = filledSlots.includes(labSlot)
			&& timetable.find((course) => (
				course.slot.replace(' ', '').split('+').includes(labSlot)
				&& course.timetableName === activeTimetableName
			));

		const reqdTheoryCourse = filledSlots.includes(theorySlot)
			&& timetable.find((course) => (
				course.slot.replace(' ', '').split('+').includes(theorySlot)
				&& course.timetableName === activeTimetableName
			));

		if (!labSlot) slotString = theorySlot;
		else if (!theorySlot) slotString = labSlot;

		if (reqdTheoryCourse) { // Is a theory slot
			return (
				<TimetableCell
					reqdCourse={reqdTheoryCourse}
					key={`TimetableBodyCell-${slotString}`}
					isFilled
				>
					{slotString}
				</TimetableCell>
			);
		}

		if (reqdLabCourse) { // Is a lab slot
			return (
				<TimetableCell
					reqdCourse={reqdLabCourse}
					key={`TimetableBodyCell-${slotString}`}
					isFilled
					isLab
				>
					{slotString}
				</TimetableCell>
			);
		}

		return <TimetableCell key={`TimetableBodyCell-${slotString}`}>{slotString}</TimetableCell>;
	});

	return (
		<tr className={styles.timetableBodyRow}>
			{rowCells}
		</tr>
	);
});

const TimetableBody = memo(({
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
});

const MobileTimetable = memo(({ timetable, activeTimetableName, filledSlots }) => (
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
));

const DesktopTimetable = memo(({ timetable, activeTimetableName, filledSlots }) => (
	<Container className={styles.timetableContainer} fluid="true">
		<table className={styles.timetable}>
			<TimetableHeader />
			<TimetableBody
				timetable={timetable}
				activeTimetableName={activeTimetableName}
				filledSlots={filledSlots}
			/>
		</table>
	</Container>
));

const Timetable = memo(({ timetable, activeTimetableName, filledSlots }) => (
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
));

export default Timetable;
