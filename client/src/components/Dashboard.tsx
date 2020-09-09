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
import MagicFill from './MagicFill';
import TimetableSwitcher from './TimetableSwitcher/TimetableSwitcher';
import Timetable from './Timetable/Timetable';
import SelectedCoursesTable from './SelectedCoursesTable/SelectedCoursesTable';

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

// Custom Hooks
import useAxiosFFCS from '../hooks/useAxiosFFCS';
import useInterval from '../hooks/useInterval';

// Models/Interfaces
import { AlertRowProps, TTErrorProps } from '../models/components/Dashboard';
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

const Dashboard = () => {
	const dispatch = useDispatch();

	const heatmapTimestamp = useSelector(
		(state: RootState) => state.course.heatmap.timestamp,
	);
	const listsTimestamp = useSelector(
		(state: RootState) => state.course.lists.timestamp,
	);
	const timetableTimestamp = useSelector(
		(state: RootState) => state.timetable.timestamp,
	);
	const selectedCurriculum = useSelector(
		(state: RootState) => state.curriculum.selectedPrefix,
	);
	const currentCurriculumData = useSelector(
		(state: RootState) => state.curriculum.currentData,
	);
	const timetable = useSelector(
		(state: RootState) => state.timetable.data,
	);

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
		dispatch(syncTimetable({
			timestamp: timetableTimestamp,
			timetable,
		}));
	}, [dispatch]);

	useInterval(
		() => dispatch(fetchHeatmap(heatmapTimestamp)),
		1000 * 60 * 2,
	);

	useInterval(
		() => dispatch(syncTimetable({
			timestamp: timetableTimestamp,
			timetable,
		})),
		1000 * 60 * 1,
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

	const generateTimetable = (prefs: TTGenPreferences) => {
		executePostGenerateTT({
			data: { pref: prefs },
		});
	};

	return (
		<Container fluid className={styles.mainContainer}>
			<Row className={styles.navBarRow}>
				<CustomNavbar />
			</Row>

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

			<TTError
				error={timetableGenerationError}
				setTimetableGenerationError={setTimetableGenerationError}
			/>

			<AlertRow
				show={showAlert}
				setShowAlert={setShowAlert}
			/>

			<Row>
				<Timetable />
			</Row>

			<Row>
				<SelectedCoursesTable />
			</Row>

		</Container>
	);
};

export default Dashboard;
