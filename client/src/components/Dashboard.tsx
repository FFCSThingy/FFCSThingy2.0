import React, { useState, useEffect, FC } from 'react';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
	Container, Row, Col, Alert,
} from 'react-bootstrap';

// Components
import CustomNavbarContainer from './CustomNavbar/CustomNavbarContainer';

import CourseSelectionContainer from './CourseSelection/CourseSelectionContainer';
import SlotTableContainer from './SlotTable/SlotTableContainer';

import MagicFill from './MagicFill';
import TimetableSwitcherContainer from './TimetableSwitcher/TimetableSwitcherContainer';
import TimetableContainer from './Timetable/TimetableContainer';

import SelectedCoursesTableContainer from './SelectedCoursesTable/SelectedCoursesTableContainer';

import styles from '../css/Dashboard.module.scss';

// Custom Hooks
import useAxiosFFCS from '../hooks/useAxiosFFCS';
import useInterval from '../hooks/useInterval';

// Models/Interfaces
import DashboardProps, { AlertRowProps, TTErrorProps } from '../models/components/Dashboard';
import TTGenPreferences from '../models/data/TTGenPreferences';

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

const Dashboard: FC<DashboardProps> = ({
	handleUnauth,
	setHeatmap: setHeatmapRedux,
	setPrefixList,
	setSelectedCurriculum,
	setCurrentCurriculumData,
	selectedCurriculum,
}) => {
	const [{ data: userData }] = useAxiosFFCS({
		url: '/account',
	});

	const [{ data: completedCoursesResponse }] = useAxiosFFCS({
		url: '/user/completedCourses',
	});

	const [{ data: curriculumListResponse }] = useAxiosFFCS({
		url: '/curriculum/prefixes',
	});

	const [{ data: heatmapResponse }, executeGetHeatmapResponse] = useAxiosFFCS({
		url: '/course/fullHeatmap',
	}, { manual: true });

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

	const [{ data: currentCurriculumResponse }, executeGetCurrentCurriculumResponse] = useAxiosFFCS({
		url: `curriculum/curriculumFromPrefix/${selectedCurriculum || '19BCE'}`,
	}, { manual: true });

	const [showMagicFill, setShowMagicFill] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [timetableGenerationError, setTimetableGenerationError] = useState('');

	// Gets heatmap response from server
	useEffect(() => {
		executeGetHeatmapResponse();
	}, [executeGetHeatmapResponse]);

	// Sets up 2 minute interval for heatmap sync
	useInterval(executeGetHeatmapResponse, 1000 * 60 * 2);

	// Sets heatmap in state
	useEffect(() => {
		if (heatmapResponse) {
			const { heatmap: resHeatmap, timestamp } = heatmapResponse.data;
			setHeatmapRedux(resHeatmap, timestamp);
		}
	}, [heatmapResponse, setHeatmapRedux]);

	useEffect(() => {
		if (curriculumListResponse) {
			if (!curriculumListResponse.data.includes(selectedCurriculum)) {
				setSelectedCurriculum(curriculumListResponse.data[0]);
			}
			setPrefixList(curriculumListResponse.data);
		}
	}, [
		curriculumListResponse,
		setPrefixList,
		selectedCurriculum,
		setSelectedCurriculum,
	]);

	// Gets currently selected curriculum data from server
	useEffect(() => {
		executeGetCurrentCurriculumResponse();
	}, [executeGetCurrentCurriculumResponse, selectedCurriculum]);

	// Updates selected curriculum prefix in localStorage
	useEffect(() => {
		localStorage.setItem('selectedCurriculum', selectedCurriculum);
		setSelectedCurriculum(selectedCurriculum);
	}, [selectedCurriculum, setSelectedCurriculum]);

	// Sets Curriculum in LocalStorage corresponding to prefix
	// Ex - 19BCE: {Data...}
	useEffect(() => {
		const selectedCurriculumData = JSON.parse(localStorage.getItem(selectedCurriculum) || '{}');

		if (currentCurriculumResponse && currentCurriculumResponse.data) {
			setCurrentCurriculumData(currentCurriculumResponse.data);
			localStorage.setItem(selectedCurriculum, JSON.stringify(currentCurriculumResponse.data));
		} else if (selectedCurriculumData) {
			setCurrentCurriculumData(selectedCurriculumData);
		}
	}, [
		currentCurriculumResponse,
		selectedCurriculum,
		setCurrentCurriculumData,
	]);

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
					userDetails={userData}
					doLogout={handleUnauth as any}
					// Oh Lord, Forgive me for the sins I have committed with this typecast, but there was no better way to keep my sanity intact and this code working strictly
				/>
			</Row>

			<Row className={styles.slotSelectionRow}>
				<Col xs={12} md={4}>
					<CourseSelectionContainer
						completedCourses={completedCoursesResponse ? completedCoursesResponse.data : []}
					/>
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

			<Row>
				<MagicFill
					show={showMagicFill}
					user={userData}
					inProcess={postGenerateTTLoading}
					genTT={(prefs: TTGenPreferences) => { generateTimetable(prefs); }}
				/>
			</Row>

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
