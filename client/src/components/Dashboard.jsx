import React from 'react';
import { Redirect } from 'react-router-dom';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
	Container, Row, Col, Alert,
} from 'react-bootstrap';

// Components
import ReactGA from 'react-ga';
import CourseSelectTable from './CourseSelectTable';
import SlotTable from './SlotTable';
import Timetable from './Timetable';
import SelectedCoursesTable from './SelectedCoursesTable';
import TimetableSwitcher from './TimetableSwitcher';
import CustomNavbar from './CustomNavbar';

// Constants
import THEMES from '../constants/Themes';
import CLASHMAP from '../constants/ClashMap';

import '../css/Dashboard.scss';
import '../css/CustomNavbar.scss';

import API from '../API';
// import MagicFill from './MagicFill';

ReactGA.initialize('UA-121295619-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class Dashboard extends React.Component {
	unauthRedirect = (<Redirect to="/" />);

	constructor(props) {
		super(props);
		this.state = {
			authenticated: true,
			activeTimetable: 'Default',
			user: {},
			generatingInProcess: false,
			submitted_regno: '',

			timetable: [],
			timetableTimestamp: localStorage.getItem('timetableTimestamp') || null,
			timetableNames: ['Default'],

			selectedCourse: '',
			currentlySelectedCourseSlots: [],
			completedCourses: {},

			heatmap: JSON.parse(localStorage.getItem('heatmap')) || [],
			heatmapTimestamp: localStorage.getItem('heatmapTimestamp') || null,

			curriculumList: ['Curriculum'],
			curriculum: localStorage.getItem(localStorage.getItem('selectedCurriculum')) || {},
			selectedCurriculum: localStorage.getItem('selectedCurriculum') || 'Curriculum',

			activeTheme: localStorage.getItem('theme') || 'default',

			alertShow: true,
			clashMap: CLASHMAP,
		};
	}

	componentDidMount() {
		this.getAccount();
		this.updateTheme();
		this.getSelectedCourses();
		this.getFullHeatmap();
		this.getPrefixes();
		this.getCurriculum(this.state.selectedCurriculum);
		this.changeActiveTimetable();
		this.getTimetableNames();

		this.heatmapInterval = setInterval(
			() => this.getFullHeatmap(),
			1000 * 2 * 60,
		);
		this.courseSyncInterval = setInterval(
			() => this.getSelectedCourses(),
			1000 * 60,
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.activeTheme !== prevState.activeTheme) { this.updateTheme(); }
	}

	componentWillUnmount() {
		clearInterval(this.heatmapInterval);
		clearInterval(this.courseSyncInterval);
	}

	getAccount = () => {
		API.get('/account')
			.then((res) => {
				if (res.status === 304);
				else {
					this.setState({ user: res.data });
				}

				if (res.data.vtopSignedIn) this.getCompletedCourses();
			})
			.catch((err) => {
				if (err.response.status === 401) this.props.handleUnauth();
			});
	};

	getCompletedCourses = () => {
		API.get('/user/completedCourses').then((res) => {
			if (res.status === 304);
			this.setState({ completedCourses: res.data.data });
		});
	};

	getSelectedCourses = () => {
		API.get('/user/selectedCourses')
			.then((res) => {
				if (res.data.success) {
					if (res.status === 304) {
						this.setState({
							timetable: JSON.parse(
								localStorage.getItem('timetable'),
							),
						});
					} else {
						this.setState({ timetable: res.data.data });
						localStorage.setItem(
							'timetable',
							JSON.stringify(res.data.data),
						);
						// localStorage.setItem('heatmapTimestamp', res.data.data.timestamp);
					}
					this.changeActiveTimetable(this.state.activeTimetable);
				} else this.setState({ error: res.data.message });
			})
			.catch((err) => {
				if (err.response.status === 401) this.props.handleUnauth();
			});
	};

	getTimetableNames = () => {
		API.get('/user/selectedCourses')
			.then((res) => {
				if (res.data.success) {
					let names = Array.from(
						new Set(res.data.data.map((v) => v.timetableName)),
					);
					if (names.length === 0) names = ['Default'];
					this.setState({ timetableNames: names });
					this.changeActiveTimetable();
				} else this.setState({ error: res.data.message });
			})
			.catch((err) => {
				if (err.response.status === 401) this.props.handleUnauth();
			});
	};

	getFullHeatmap = () => {
		API.get('/course/fullHeatmap')
			.then((res) => {
				if (res.data.success) {
					if (res.status === 304) {
						this.setState({
							heatmap: JSON.parse(localStorage.getItem('heatmap')),
						});
					} else {
						this.setState({
							heatmap: res.data.data.heatmap,
							heatmapTimestamp: res.data.data.timestamp,
						});
						localStorage.setItem(
							'heatmap',
							JSON.stringify(res.data.data.heatmap),
						);
						localStorage.setItem(
							'heatmapTimestamp',
							res.data.data.timestamp,
						);
					}
				} else this.setState({ error: res.data.message });
			})
			.catch((err) => {
				if (err.response.status === 401) this.props.handleUnauth();
			});
	};

	getPrefixes = () => {
		API.get('/curriculum/prefixes')
			.then((res) => {
				if (res.data.success) {
					this.setState({
						curriculumList: ['Curriculum', ...res.data.data],
						selectedCurriculum: 'Curriculum',
					});
				} else this.setState({ error: res.data.message });
			})
			.catch((err) => {
				if (err.response.status === 401) this.props.handleUnauth();
			});
	};

	getCurriculum = (prefix) => {
		if (prefix === 'Curriculum') {
			this.setState({ curriculum: {}, selectedCurriculum: 'Curriculum' });
			localStorage.setItem('selectedCurriculum', 'Curriculum');
			return;
		}

		API.get(`/curriculum/curriculumFromPrefix/${prefix}`)
			.then((res) => {
				if (res.data.success) {
					this.setState({
						curriculum: res.data.data,
						selectedCurriculum: prefix,
					});
					localStorage.setItem(prefix, JSON.stringify(res.data.data));
					localStorage.setItem('selectedCurriculum', prefix);
				} else this.setState({ error: res.data.message });
			})
			.catch((err) => {
				if (err.response.status === 401) this.props.handleUnauth();
			});
	};

	setSelectedCourses = (timetable) => {
		API.post('/user/selectedCoursesBulk', { selected_courses: timetable })
			.catch((err) => {
				if (err.response.status === 401) this.props.handleUnauth();
			});
	};

	getCreditCount() {
		const count = this.state.timetable.reduce((a, v) => {
			if (v.timetableName === this.state.activeTimetable) { return a + Number(v.credits); }
			return a;
		}, 0);

		if (!count) return 0;
		return count;
	}

	findAvailableCourseTypes = () => Array.from(
		new Set(this.state.currentlySelectedCourseSlots.map((course) => course.simpleCourseType)),
	).sort();

	findAvailableVenues = (type = null) => {
		const venueRegex = /^[A-Z]+/;
		return Array.from(
			new Set(
				this.state.currentlySelectedCourseSlots
					.filter((c) => !(c.venue === 'NIL'))
					.filter((c) => {
						if (type) return c.simpleCourseType === type;
						return true;
					})
					.map((course) => {
						const s = course.venue.match(venueRegex)[0];
						if (s.endsWith('G')) return s.slice(0, -1);
						return s;
					}),
			),
		).sort();
	};

	doLogout = () => {
		API.get('/logout')
			.then(() => {
				this.props.handleUnauth();
			})
			.catch((err) => {
				if (err.response.status === 401) this.props.handleUnauth();
			});
	};

	checkClash = (slot) => {
		const filledSlots = this.getFilledSlots();
		if (slot === 'NIL') return false;
		if (filledSlots.length === 0) return false;

		const clashingSlots = slot.replace(' ', '').split('+').reduce((a, v) => Array.from(new Set([...a, this.state.clashMap[v].currentlyClashesWith])), []).filter((v) => v && v.length > 0);

		return clashingSlots;
	};

	checkSelected = (course) => this.state.timetable.find(
		(e) => e.code === course.code
			&& e.faculty === course.faculty
			&& e.slot === course.slot
			&& e.venue === course.venue
			&& e.course_type === course.course_type
			&& this.state.activeTimetable === e.timetableName,
	);

	getFilledSlots = () => Object.keys(this.state.clashMap).reduce((a, v) => {
		if (this.state.clashMap[v].isFilled) a.push(v);
		return a;
	}, []);

	checkAndSelectProject = (course) => {
		const reqdCourse = this.state.heatmap.filter(
			(v) => course.code === v.code
				&& course.faculty === v.faculty
				&& ['PJT', 'EPJ'].includes(v.course_type),
		);

		if (reqdCourse.length === 0) return;
		if (!this.checkSelected(reqdCourse[0])) {
			const [req] = reqdCourse[0];
			req.simpleCourseType = 'Project';
			this.selectSlots(req);
		}
	};

	updateCurrentlyClashesWith = () => this.setState((prevState) => {
		const { clashMap } = prevState;
		const filledSlots = this.getFilledSlots();

		Object.keys(clashMap).map((slot) => {
			const currentClashes = clashMap[slot].clashesWith.reduce((acc, clashesWithSlot) => {
				if (filledSlots.includes(clashesWithSlot)) { acc.push(clashesWithSlot); }
				return acc;
			}, []);

			clashMap[slot].currentlyClashesWith = currentClashes;
			return slot;
		});

		return { clashMap };
	});

	selectSlots = (course) => {
		course.timetableName = this.state.activeTimetable;

		if (course.slot !== 'NIL') {
			course.slot
				.replace(' ', '')
				.split('+')
				.map((v) => this.setState((prevState) => {
					const clashMap = { ...prevState.clashMap };
					clashMap[v].isFilled = true;
					return { clashMap };
				}));

			if (course.simpleCourseType !== 'Project') { this.checkAndSelectProject(course); }
		}

		this.setState(
			(prevState) => {
				const timetable = Array.from(
					new Set([...prevState.timetable, course]),
				);
				return { timetable };
			},
			() => {
				this.setSelectedCourses(this.state.timetable);
				this.updateCurrentlyClashesWith();
			},
		);
	};

	unselectSlots = (course) => {
		if (course.slot !== 'NIL') {
			course.slot
				.replace(' ', '')
				.split('+')
				.map((v) => this.setState((prevState) => {
					const clashMap = { ...prevState.clashMap };
					clashMap[v].isFilled = false;
					return { clashMap };
				}));
		}

		this.setState(
			(prevState) => {
				const timetable = prevState.timetable.filter(
					(v) => !(
						course.code === v.code
						&& course.faculty === v.faculty
						&& course.slot === v.slot
						&& course.venue === v.venue
						&& v.timetableName === prevState.activeTimetable
					),
				);
				return { timetable };
			},
			() => {
				this.setSelectedCourses(this.state.timetable);
				this.updateCurrentlyClashesWith();
			},
		);
	};

	selectCourse = (code) => {
		this.setState((prevState) => ({
			selectedCourse: code,
			currentlySelectedCourseSlots: prevState.heatmap.filter((course) => course.code === code),
		}));
	};

	changeActiveTimetable = (timetableName = 'Default') => {
		// if(timetableName === this.state.activeTimetable)
		// return;

		const slots = this.state.timetable.reduce((a, v) => {
			if (v.timetableName === timetableName && v.slot !== 'NIL') { return [...a, ...v.slot.replace(' ', '').split('+')]; }
			return a;
		}, []);

		this.setState((prevState) => {
			const clashMap = { ...prevState.clashMap };
			Object.keys(clashMap).map((v) => {
				if (slots.includes(v)) clashMap[v].isFilled = true;
				else clashMap[v].isFilled = false;
				return v;
			});
			return { clashMap, activeTimetable: timetableName };
		}, () => this.updateCurrentlyClashesWith());
	};

	modifyTimetableNames = (newList) => {
		this.setState({
			timetableNames: newList,
		});
	};

	doTimetableDelete = () => {
		if (this.state.activeTimetable === 'Default') return;
		this.setState(
			(prevState) => ({
				timetable: prevState.timetable.filter(
					(v) => v.timetableName !== prevState.activeTimetable,
				),
				timetableNames: prevState.timetableNames.filter(
					(v) => v !== prevState.activeTimetable,
				),
			}),
			() => {
				this.setSelectedCourses(this.state.timetable);
				this.changeActiveTimetable();
			},
		);
	};

	doTimetableAdd = (newName) => {
		if (this.state.timetableNames.includes(newName)) return;

		this.setState(
			(prevState) => ({
				timetableNames: [...prevState.timetableNames, newName],
			}),
			() => {
				this.changeActiveTimetable(newName);
			},
		);
	};

	doTimetableEdit = (newName) => {
		if (this.state.timetableNames.includes(newName)) return;
		if (this.state.activeTimetable === 'Default') return;

		this.setState(
			(prevState) => ({
				timetableNames: prevState.timetableNames.map((v) => {
					if (v === prevState.activeTimetable) return newName;
					return v;
				}),

				timetable: prevState.timetable.map((v) => {
					if (v.timetableName === prevState.activeTimetable) {
						v.timetableName = newName;
						return v;
					}
					return v;
				}),
			}),
			() => {
				this.setSelectedCourses(this.state.timetable);
				this.changeActiveTimetable(newName);
			},
		);
	};

	doTimetableCopy = (newName) => {
		if (this.state.timetableNames.includes(newName)) return;

		this.setState(
			(prevState) => ({
				timetableNames: [...prevState.timetableNames, newName],
				timetable: [
					...prevState.timetable,
					...prevState.timetable.map((v) => {
						if (v.timetableName === prevState.activeTimetable) { v.timetableName = newName; }
						return v;
					}),
				],
			}),
			() => {
				this.setSelectedCourses(this.state.timetable);
				this.changeActiveTimetable(newName);
			},
		);
	};

	updateTheme = () => {
		const theme = THEMES[this.state.activeTheme];
		localStorage.setItem('theme', this.state.activeTheme);
		Object.keys(theme.properties).map((v) => document.documentElement.style.setProperty(
			`--${v}`,
			theme.properties[v],
		));
	};

	changeActiveTheme = (newTheme) => {
		this.setState({ activeTheme: newTheme });
	};

	handleCurriculumChange = (val) => {
		this.getCurriculum(val);
		this.setState({ selectedCurriculum: val });
	};

	genTT = (prefs) => {
		this.setState({ generatingInProcess: true });
		API.post('/ttgen/generateTimetable', { pref: prefs })
			.then((res) => {
				if (res.data.success) {
					const tt = res.data.data;
					this.setState({ ttError: undefined });
					const newName = tt[0].timetableName;
					this.setState(
						(prevState) => ({
							timetableNames: [
								...prevState.timetableNames,
								newName,
							],
							timetable: [...prevState.timetable, ...tt],
						}),
						() => {
							this.changeActiveTimetable(newName);
							this.setSelectedCourses(this.state.timetable);
						},
					);
				} else this.setState({ ttError: res.data.message });
				this.setState({ generatingInProcess: false });
			})
			.catch(() => {
				this.setState({ generatingInProcess: false });
			});
	};

	renderTTErrors = () => {
		if (this.state.ttError) {
			return (
				<Row>
					<Alert
						variant="danger"
						onClose={() => this.setState({ ttError: undefined })}
						dismissible
					>
						<p>{this.state.ttError}</p>
					</Alert>
				</Row>
			);
		} return (<></>);
	};

	render() {
		return (
			<Container fluid>
				<Row className="navBarRow">
					<CustomNavbar
						user={this.state.user}
						creditCount={this.getCreditCount()}
						themes={THEMES}
						curriculumList={this.state.curriculumList}
						selectedCurriculum={this.state.selectedCurriculum}
						handleCurriculumChange={this.handleCurriculumChange}
						changeActiveTheme={this.changeActiveTheme}
						doLogout={this.doLogout}
					/>
				</Row>

				{/*
					this.state.alertShow ?
						<Row>
							<Alert variant="danger" onClose={() => this.setState({ alertShow: false })} dismissible>
								<Alert.Heading>Courses Updated</Alert.Heading>
								<p>
									If you notice courses missing from your timetable, it might be due to them being removed to keep it in sync with the available courses from the Course Allocation Report.
								</p>
							</Alert>
						</Row> : <></>
				*/}

				<Row className="slotSelectionRow">
					<Col xs={12} md={4}>
						<CourseSelectTable
							selectCourse={this.selectCourse}
							handleUnauth={this.props.handleUnauth}
							completedCourses={this.state.completedCourses}
							heatmap={this.state.heatmap}
							selectedCourse={this.state.selectedCourse}
							curriculum={this.state.curriculum}
							selectedCurriculum={this.state.selectedCurriculum}
						/>
					</Col>

					<Col xs={12} md={8}>
						<SlotTable
							selectSlots={this.selectSlots}
							checkClash={this.checkClash}
							checkSelected={this.checkSelected}
							slots={this.state.currentlySelectedCourseSlots}
							selectedCourse={this.state.selectedCourse}
							types={this.findAvailableCourseTypes()}
							venues={this.findAvailableVenues()}
							theoryVenues={this.findAvailableVenues('Theory')}
							labVenues={this.findAvailableVenues('Lab')}
							projectVenues={this.findAvailableVenues('Project')}
						/>
					</Col>
				</Row>
				{/* <Row>
						<MagicFill
							user={this.state.user}
							inProcess={this.state.generatingInProcess}
							genTT={(prefs) => {this.genTT(prefs)}}
						/>
					</Row>
					{this.renderTTErrors()} */}
				<Row>
					<Col>
						<TimetableSwitcher
							activeTimetable={this.state.activeTimetable}
							timetableNames={this.state.timetableNames}
							changeActiveTimetable={this.changeActiveTimetable}
							modifyTimetableNames={this.modifyTimetableNames}
							doEdit={this.doTimetableEdit}
							doDelete={this.doTimetableDelete}
							doNew={this.doTimetableAdd}
							doCopy={this.doTimetableCopy}
						/>
					</Col>
				</Row>

				<Row>
					<Timetable
						clashMap={this.state.clashMap}
						filledSlots={this.getFilledSlots()}
						timetable={this.state.timetable}
						activeTimetableName={this.state.activeTimetable}
					/>
				</Row>

				<Row>
					<SelectedCoursesTable
						timetable={this.state.timetable}
						unselectSlot={this.unselectSlots}
						activeTimetableName={this.state.activeTimetable}
						creditCount={this.getCreditCount()}
					/>
				</Row>
			</Container>
		);
	}
}
export default Dashboard;
