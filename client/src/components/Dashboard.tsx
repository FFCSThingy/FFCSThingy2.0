import React, { useState, useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
	Container, Row, Col, Alert,
} from 'react-bootstrap';

// Components
import CustomNavbar from './CustomNavbar/CustomNavbar';
import CourseSelection from './CourseSelection/CourseSelection';
import SlotTable from './SlotTable/SlotTable';
// import MagicFill from './MagicFill';
import TimetableSwitcher from './TimetableSwitcher/TimetableSwitcher';
import Timetable from './Timetable/Timetable';
import SelectedCoursesTable from './SelectedCoursesTable/SelectedCoursesTable';

import Toasts from './Toasts/Toasts';
// CSS
import styles from '../css/Dashboard.module.scss';

// Actions
import { fetchUserDetails, fetchCompletedCourses } from '../reducers/user';
import {
	fetchCurriculumPrefixes,
	fetchCurriculumFromPrefix,
	setCurrentCurriculumData,
} from '../reducers/curriculum';
import { fetchHeatmap, fetchAllCourseLists } from '../reducers/course';
import { syncTimetable } from '../reducers/timetable';

// Selectors
import { selectHeatmapTimestamp, selectListsTimestamp } from '../selectors/course';
import { selectTimetable, selectTimetableTimestamp } from '../selectors/timetable';
import { selectCurrentCurriculumData, selectSelectedPrefix } from '../selectors/curriculum';
import { selectIsAuthenticated } from '../selectors/auth';

// Custom Hooks
// import useAxiosFFCS from '../hooks/useAxiosFFCS';
import useInterval from '../hooks/useInterval';

// Models/Interfaces
import {
	AlertRowProps,
	// TTErrorProps,
} from '../models/components/Dashboard';
// import TTGenPreferences from '../models/data/TTGenPreferences';

const AlertRow: FC<AlertRowProps> = ({ show = false, setShowAlert }) => (show ? (
	<Row>
		<Alert
			className={styles.alert}
			variant="danger"
			onClose={() => setShowAlert(false)}
			dismissible
		>
			<Alert.Heading>Courses Updated</Alert.Heading>
			<p>
				If you notice courses missing from your timetable,
				it might be due to them being removed to keep it in
				sync with the available courses from the Course Allocation Report.
			</p>
		</Alert>
	</Row>
) : (<></>));

// const TTError: FC<TTErrorProps> = ({ error = '', setTimetableGenerationError }) => (error ? (
// 	<Row>
// 		<Alert
// 			variant="danger"
// 			onClose={() => setTimetableGenerationError('')}
// 			dismissible
// 		>
// 			<p>{error}</p>
// 		</Alert>
// 	</Row>
// ) : (<></>));

const Dashboard = () => {
	const dispatch = useDispatch();

	const heatmapTimestamp = useSelector(selectHeatmapTimestamp);
	const listsTimestamp = useSelector(selectListsTimestamp);
	const timetableTimestamp = useSelector(selectTimetableTimestamp);
	const timetable = useSelector(selectTimetable);
	const selectedCurriculum = useSelector(selectSelectedPrefix);
	const currentCurriculumData = useSelector(selectCurrentCurriculumData);
	const isAuthenticated = useSelector(selectIsAuthenticated);

	// const [
	//	{ data: postGenerateTTResponse, loading: postGenerateTTLoading },
	//	executePostGenerateTT,
	// ] = useAxiosFFCS({
	// 	url: '/ttgen/generateTimetable',
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// }, { manual: true });

	// const [showMagicFill, setShowMagicFill] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	// const [timetableGenerationError, setTimetableGenerationError] = useState('');

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(fetchUserDetails());
			dispatch(fetchCompletedCourses());
			dispatch(syncTimetable({
				timestamp: timetableTimestamp,
				timetable,
			}));
		}

		dispatch(fetchCurriculumPrefixes());
		dispatch(fetchHeatmap(heatmapTimestamp));
		dispatch(fetchAllCourseLists(listsTimestamp));
	// Only needs to run on component load
	// Don't add other dependencies
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated]);

	useInterval(
		() => dispatch(fetchHeatmap(heatmapTimestamp)),
		1000 * 60 * 2,
	);

	useInterval(
		() => {
			if (isAuthenticated) {
				return dispatch(syncTimetable({
					timestamp: timetableTimestamp,
					timetable,
				}));
			}
			return null;
		},
		1000 * 60 * 1,
	);

	// Fetches curriculum based on prefix
	useEffect(() => {
		const selectedCurriculumData = localStorage.getItem(selectedCurriculum);

		if (!selectedCurriculumData || selectedCurriculumData === '[]') {
			dispatch(fetchCurriculumFromPrefix(selectedCurriculum));
		} else {
			dispatch(setCurrentCurriculumData(JSON.parse(
				selectedCurriculumData,
			)));
		}
	}, [dispatch, selectedCurriculum]);

	// Updates curriculum for prefix in localStorage
	useEffect(() => {
		if (
			selectedCurriculum !== 'Curriculum'
		) {
			localStorage.setItem(
				selectedCurriculum,
				JSON.stringify(currentCurriculumData),
			);
		}
	// Don't add selectedCurriculum to the list of dependencies
	// Might cause race condition where the wrong curriculum is saved
	// For the wrong prefix
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentCurriculumData]);

	// const generateTimetable = (prefs: TTGenPreferences) => {
	// 	executePostGenerateTT({
	// 		data: { pref: prefs },
	// 	});
	// };

	return (
		<Container fluid className={styles.mainContainer}>
			<Row className={styles.navBarRow}>
				<CustomNavbar />
			</Row>

			<Toasts />

			<Row className={styles.slotSelectionRow}>
				<Col xs={12} md={4}>
					<CourseSelection />
				</Col>

				<Col xs={12} md={8}>
					<SlotTable />
				</Col>
			</Row>

			<Row>
				<Col>
					<TimetableSwitcher />
				</Col>
			</Row>

			{/* <Row>
				<MagicFill
					show={showMagicFill}
					user={userData}
					inProcess={postGenerateTTLoading}
					genTT={(prefs: TTGenPreferences) => { generateTimetable(prefs); }}
				/>
			</Row> */}

			{/* <TTError
				error={timetableGenerationError}
				setTimetableGenerationError={setTimetableGenerationError}
			/> */}

			<AlertRow
				show={showAlert}
				setShowAlert={setShowAlert}
			/>

			<Row id="timetable">
				<Timetable />
			</Row>

			<Row>
				<SelectedCoursesTable />
			</Row>

		</Container>
	);
};

export default Dashboard;
