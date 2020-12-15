import React, { memo } from 'react';
import MediaQuery from 'react-responsive';
import { Container } from 'react-bootstrap';
import { FaSun } from 'react-icons/fa';

import TimetableHeader from './TimetableHeader';
import TimetableBody from './TimetableBody';

import styles from '../../css/Timetable.module.scss';

const MobileTimetable = memo(() => (
	<Container className={styles.timetableContainer}>
		<FaSun className={styles.morningIcon} size="2x" color="yellow" />
		<table className={styles.timetableA}>
			<TimetableHeader isMobile />
			<TimetableBody
				isMobile
			/>
		</table>

		<FaSun className={styles.eveningIcon} size="2x" />
		<table className={styles.timetableB}>
			<TimetableHeader isMobile isAfternoon />
			<TimetableBody
				isMobile
				isAfternoon
			/>
		</table>
	</Container>
));

const DesktopTimetable = memo(() => (
	<Container className={styles.timetableContainer} fluid>
		<table className={styles.timetable}>
			<TimetableHeader />
			<TimetableBody />
		</table>
	</Container>
));

const Timetable = memo(() => (
	// Media Query for phones
	<MediaQuery minDeviceWidth={768}>
		{(matches) => (matches ? <DesktopTimetable /> : <MobileTimetable />)}
	</MediaQuery>
));

export default Timetable;
