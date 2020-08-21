import React, { memo, FC } from 'react';
import MediaQuery from 'react-responsive';
import { Container } from 'react-bootstrap';
import { FaSun } from 'react-icons/fa';

import TimetableProps from '../../models/components/Timetable/Timetable';

import TimetableHeader from './TimetableHeader';
import TimetableBody from './TimetableBody';

import styles from '../../css/Timetable.module.scss';

const MobileTimetable: FC<TimetableProps> = memo(
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
	),
);

const DesktopTimetable: FC<TimetableProps> = memo(
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
	),
);

const Timetable: FC<TimetableProps> = memo(
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
	),
);

export default Timetable;
