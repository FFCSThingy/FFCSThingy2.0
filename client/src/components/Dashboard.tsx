import React, { useState, useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
	Container, Row, Col, Alert,
} from 'react-bootstrap';

// Components
import CustomNavbarContainer from './CustomNavbar/CustomNavbarContainer';
import CourseSelection from './CourseSelection/CourseSelection';
import SlotTableContainer from './SlotTable/SlotTableContainer';
import MagicFill from './MagicFill';
import TimetableSwitcherContainer from './TimetableSwitcher/TimetableSwitcherContainer';
import TimetableContainer from './Timetable/TimetableContainer';
import SelectedCoursesTableContainer from './SelectedCoursesTable/SelectedCoursesTableContainer';

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

// Custom Hooks
import useAxiosFFCS from '../hooks/useAxiosFFCS';
import useInterval from '../hooks/useInterval';

// Models/Interfaces
import DashboardProps, { AlertRowProps, TTErrorProps } from '../models/components/Dashboard';
import TTGenPreferences from '../models/data/TTGenPreferences';
import { RootState } from '../app/rootReducer';

const AlertRow: FC<AlertRowProps> = ({ show = false, setShowAlert }) => (show ? (
	<Row>
		<Alert className={styles.alert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
			<Alert.Heading>Courses Updated</Alert.Heading>
			<p>
				If you notice courses missing from your timetable, it might be due to them being removed to keep it in sync with the available courses from the Course Allocation Report.
			</p>
		</Alert>
	</Row>
) : (<></>));

const TTError: FC<TTErrorProps> = ({ error = '', setTimetableGenerationError }) => (error ? (
	<Row>
		<Alert
			variant="danger"
			onClose={() => setTimetableGenerationError('')}
			dismissible
		>
			<p>{error}</p>
		</Alert>
	</Row>
) : (<></>));

const Dashboard: FC<DashboardProps> = ({ handleUnauth }) => {
	const dispatch = useDispatch();

	const heatmapTimestamp = useSelector(
		(state: RootState) => state.course.heatmap.timestamp,
	);
	const listsTimestamp = useSelector(
		(state: RootState) => state.course.lists.timestamp,
	);
	const selectedCurriculum = useSelector(
		(state: RootState) => state.curriculum.selectedPrefix,
	);
	const currentCurriculumData = useSelector(
		(state: RootState) => state.curriculum.currentData,
	);

	const [{ data: timetableResponse }, executeGetTimetableResponse] = useAxiosFFCS({
		url: '/user/selectedCourses',
	}, { manual: true });

	const [{ }, executePostSelectedCourses] = useAxiosFFCS({
		url: '/user/selectedCoursesBulk',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	}, { manual: true });

	const [{ data: postGenerateTTResponse, loading: postGenerateTTLoading }, executePostGenerateTT] = useAxiosFFCS({
		url: '/ttgen/generateTimetable',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	}, { manual: true });

	const [showMagicFill, setShowMagicFill] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [timetableGenerationError, setTimetableGenerationError] = useState('');

	useEffect(() => {
		dispatch(fetchUserDetails());
		dispatch(fetchCompletedCourses());
		dispatch(fetchCurriculumPrefixes());
		dispatch(fetchHeatmap(heatmapTimestamp));
		dispatch(fetchAllCourseLists(listsTimestamp));
	}, [dispatch]);

	useInterval(
		() => dispatch(fetchHeatmap(heatmapTimestamp)),
		1000 * 60 * 2,
	);

	// Fetches curriculum based on prefix
	useEffect(() => {
		const selectedCurriculumData = JSON.parse(
			localStorage.getItem(selectedCurriculum) || '[]',
		);

		if (!selectedCurriculumData) {
			dispatch(fetchCurriculumFromPrefix(selectedCurriculum));
		} else {
			dispatch(setCurrentCurriculumData(selectedCurriculumData));
		}

		localStorage.setItem('selectedCurriculum', selectedCurriculum);
	}, [dispatch, selectedCurriculum]);

	// Updates curriculum for prefix in localStorage
	useEffect(() => {
		if (
			!localStorage.getItem(selectedCurriculum)
			&& selectedCurriculum !== 'Curriculum'
		) {
			localStorage.setItem(
				selectedCurriculum,
				JSON.stringify(currentCurriculumData),
			);
		}
	}, [currentCurriculumData]);

	// Gets user timetable from the server
	useEffect(() => {
		executeGetTimetableResponse();
	}, [executeGetTimetableResponse]);

	// Sets up 3 minute interval for timetable sync
	useInterval(executeGetTimetableResponse, 1000 * 60);

	// Sets timetable in state
	useEffect(() => {
		if (timetableResponse) {
			// setUserTimetable(timetableResponse.data);
		}
	}, [timetableResponse]);

	// TTGen
	useEffect(() => {
		if (postGenerateTTResponse) {
			const { success } = postGenerateTTResponse;
			if (success) {
				const { data } = postGenerateTTResponse;
				// setUserTimetable((prevTimetable) => {
				// 	let newTimetable = [...data];

				// 	if (prevTimetable) {
				// 		newTimetable = Array.from(
				// 			new Set([...prevTimetable, ...newTimetable]),
				// 		);
				// 	}

				// 	executePostSelectedCourses({
				// 		data: { selected_courses: newTimetable },
				// 	});

				// 	return newTimetable;
				// });
			} else {
				const { message } = postGenerateTTResponse;
				setTimetableGenerationError(message);
			}
		}
	}, [postGenerateTTResponse, executePostSelectedCourses]);

	const generateTimetable = (prefs: TTGenPreferences) => {
		executePostGenerateTT({
			data: { pref: prefs },
		});
	};

	return (
		<Container fluid className={styles.mainContainer}>
			<Row className={styles.navBarRow}>
				<CustomNavbarContainer
					doLogout={handleUnauth as any}
					// Oh Lord, Forgive me for the sins I have committed with this typecast, but there was no better way to keep my sanity intact and this code working strictly
				/>
			</Row>

			<Row className={styles.slotSelectionRow}>
				<Col xs={12} md={4}>
					<CourseSelection />
				</Col>

				<Col xs={12} md={8}>
					<SlotTableContainer />
				</Col>
			</Row>

			<Row>
				<Col>
					<TimetableSwitcherContainer />
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

			<TTError
				error={timetableGenerationError}
				setTimetableGenerationError={setTimetableGenerationError}
			/>

			<AlertRow
				show={showAlert}
				setShowAlert={setShowAlert}
			/>

			<Row>
				<TimetableContainer />
			</Row>

			<Row>
				<SelectedCoursesTableContainer />
			</Row>

		</Container>
	);
};

export default Dashboard;
