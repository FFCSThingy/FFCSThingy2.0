import React, { FC, memo } from 'react';

import TimetableCell from './TimetableCell';

import { HEADERS, breakPosition } from '../../constants/Timetable';

import TimetableHeaderProps, { TimetableHeaderRowProps } from '../../models/components/Timetable/TimetableHeader';

import styles from '../../css/Timetable.module.scss';

const TimetableHeaderRow: FC<TimetableHeaderRowProps> = memo(
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
				if (!isAfternoon && i >= breakPosition) return null;

				// Only need cells after 8 for evening row1 (Because break cell)
				if (isAfternoon && rowNumber === 0 && i <= breakPosition) return null;

				// Only need cells after 7 for evening row2
				if (isAfternoon && i < 7) return null;
			} else if (rowNumber === 0 && i === breakPosition) { // Break Cell
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

const TimetableHeader: FC<TimetableHeaderProps> = memo(
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

export default TimetableHeader;