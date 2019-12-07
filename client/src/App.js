// 'Course' is now 'CourseSelect' to avoid confusion (left table)
// 'CourseTable' is the final bottom table for regisered courses

import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Alert } from 'react-bootstrap';

// Components
import CourseSelectTable from './components/CourseSelectTable';
import SlotTable from './components/SlotTable';
import Timetable from './components/Timetable';
import SelectedCoursesTable from './components/SelectedCoursesTable';
import TimetableSwitcher from './components/TimetableSwitcher';
import CustomNavbar from './components/CustomNavbar';

// Constants
import { THEMES } from './constants/Themes';
import * as COURSE from './constants/Courses';
import { CLASHMAP } from './constants/ClashMap';

import './App.css';
import './css/CustomNavbar.css'

import API from './API';
import MagicFill from './components/MagicFill';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-121295619-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends React.Component {

	constructor(state) {
		super(state);
		this.state = {
			error: null,
			activeTimetable: 'Default',
			generatingInProcess: false,
			user: {},
			submitted_regno: '',

			timetable: [],
			timetableTimestamp: localStorage.getItem('timetableTimestamp') || null,
			timetableNames: ['Default'],

			selectedCourse: '',
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

	componentDidUpdate(prevProps, prevState) {
		if (this.state.activeTheme !== prevState.activeTheme)
			this.updateTheme();
	}

	componentDidMount() {
		this.updateTheme();
		this.doGetAccount();
		this.doGetSelectedCourses();
		this.doGetFullHeatmap();
		this.doGetPrefixes();
		this.doCurriculumFetch(this.state.selectedCurriculum);
		this.changeActiveTimetable();
		this.doGetTimetableNames();

		this.heatmapInterval = setInterval(() => this.doGetFullHeatmap(), 1000 * 2 * 60);
		this.courseSyncInterval = setInterval(() => this.doGetSelectedCourses(), 1000 * 60);
	}

	componentWillUnmount() {
		clearInterval(this.heatmapInterval);
		clearInterval(this.courseSyncInterval);
	}

	handleUnauth = () => {
		return this.props.history.push('/');
	}

	doGetAccount = () => {
		API.get("/account")
			.then(res => {
				if (res.status === 304);
				// this.setState({ heatmap: JSON.parse(localStorage.getItem('heatmap')) })
				else {
					this.setState({ user: res.data });
				}

				if (res.data.vtopSignedIn) this.doGetCompletedCourses();
			}).catch(err => {
				if (err.response.status === 401) this.handleUnauth();
			});
	}

	doGetCompletedCourses = () => {
		API.get('/user/completedCourses')
			.then(res => {
				if (res.status === 304);
				this.setState({ completedCourses: res.data.data });
			})
	}

	doGetSelectedCourses = () => {
		API.get('/user/selectedCourses')
			.then(res => {
				if (res.data.success) {
					if (res.status === 304) {
						this.setState({ timetable: JSON.parse(localStorage.getItem('timetable')) })
					}
					else {
						this.setState({ timetable: res.data.data });
						localStorage.setItem('timetable', JSON.stringify(res.data.data));
						// localStorage.setItem('heatmapTimestamp', res.data.data.timestamp);
					}
					this.changeActiveTimetable(this.state.activeTimetable);
				} else
					this.setState({ error: res.data.message })
			}).catch(err => {
				if (err.response.status === 401) this.handleUnauth();
			});
	}

	doGetTimetableNames = () => {
		API.get('/user/selectedCourses')
			.then(res => {
				if (res.data.success) {
					var names = Array.from(new Set(res.data.data.map(v => v.timetableName)));
					if (names.length === 0) names = ['Default'];
					this.setState({ timetableNames: names });
					this.changeActiveTimetable();
				}
				else
					this.setState({ error: res.data.message })
			}).catch(err => {
				if (err.response.status === 401) this.handleUnauth();
			});
	}

	doGetFullHeatmap = () => {
		API.get("/course/fullHeatmap")
			.then(res => {
				if (res.data.success) {
					if (res.status === 304)
						this.setState({ heatmap: JSON.parse(localStorage.getItem('heatmap')) })
					else {
						this.setState({ heatmap: res.data.data.heatmap, heatmapTimestamp: res.data.data.timestamp });
						localStorage.setItem('heatmap', JSON.stringify(res.data.data.heatmap));
						localStorage.setItem('heatmapTimestamp', res.data.data.timestamp);
					}
				} else
					this.setState({ error: res.data.message })
			}).catch(err => {
				if (err.response.status === 401) this.handleUnauth();
			});
	}

	doGetPrefixes = () => {
		API.get("/curriculum/prefixes")
			.then(res => {
				if (res.data.success) {
					this.setState({ curriculumList: ['Curriculum', ...res.data.data], selectedCurriculum: 'Curriculum' });
				} else
					this.setState({ error: res.data.message })
			}).catch(err => {
				if (err.response.status === 401) this.handleUnauth();
			});
	}

	doCurriculumFetch = (prefix) => {
		if (prefix === 'Curriculum') {
			this.setState({ curriculum: {}, selectedCurriculum: 'Curriculum' });
			localStorage.setItem('selectedCurriculum', 'Curriculum');
			return;
		}

		API.get("/curriculum/curriculumFromPrefix/" + prefix)
			.then(res => {
				if (res.data.success) {
					this.setState({ curriculum: res.data.data, selectedCurriculum: prefix });
					localStorage.setItem(prefix, JSON.stringify(res.data.data));
					localStorage.setItem('selectedCurriculum', prefix);
				} else
					this.setState({ error: res.data.message })
			}).catch(err => {
				if (err.response.status === 401) this.handleUnauth();
			});
	}

	doLogout = () => {
		API.get('/logout').then(res => {
			this.props.history.push('/');
		}).catch(err => {
			if (err.response.status === 401) this.handleUnauth();
		});;
	}

	doSetSelectedCourses = (timetable) => {
		API.post('/user/selectedCoursesBulk', { selected_courses: timetable }).then(res => {
		}).catch(err => {
			if (err.response.status === 401) this.handleUnauth();
		});;
	}

	filterCourse = () => {
		return this.state.heatmap.filter(course => course.code === this.state.selectedCourse)
			.map(course => {
				if (COURSE.isLabType(course.course_type)) course.simple_type = 'Lab';
				if (COURSE.isProjectType(course.course_type)) course.simple_type = 'Project';
				if (COURSE.isTheoryType(course.course_type)) course.simple_type = 'Theory';

				return course;
			});
	}

	findAvailableCourseTypes = () => {
		return Array.from(new Set(
			this.filterCourse()
				.map(course => course.simple_type)
		)).sort();
	}

	findAvailableVenues = (type = null) => {
		var venueRegex = /^[A-Z]+/;
		return Array.from(new Set(
			this.filterCourse()
				.filter(c => !(c.venue === 'NIL'))
				.filter(c => {
					if (type) return c.simple_type === type;
					else return true;
				})
				.map(course => {
					var s = course.venue.match(venueRegex)[0];
					if (s.endsWith('G')) return s.slice(0, -1)
					else return s;
				})
		)).sort();
	}

	getCreditCount() {
		var count = this.state.timetable.reduce((a, v) => {
			if (v.timetableName === this.state.activeTimetable)
				return a + Number(v.credits);
			return a;
		}, 0)

		if (!count) return 0;
		return count;
	}

	checkClash = (slot) => {
		var filledSlots = this.getFilledSlots();
		if (slot === 'NIL') return false;
		if (filledSlots.length === 0) return false;

		return filledSlots.map(v => {
			return slot.replace(' ', '').split('+')
				.map(s => this.state.clashMap[s].clashesWith.includes(v))
				.reduce((a, v) => a || v, false)
		}).reduce((a, v) => a || v, false);
	}

	checkSelected = (course) => {
		return this.state.timetable.find(e => (e.code === course.code && e.faculty === course.faculty && e.slot === course.slot && e.venue === course.venue && e.course_type === course.course_type && this.state.activeTimetable === e.timetableName));
	}

	getFilledSlots = () => {
		return Object.keys(this.state.clashMap).reduce((a, v) => {
			if (this.state.clashMap[v].isFilled) a = [...a, v];
			return a;
		}, [])
	}

	checkAndSelectProject = (course) => {
		var reqdCourse = this.state.heatmap.filter(v => (course.code === v.code && course.faculty === v.faculty && ['PJT', 'EPJ'].includes(v.course_type)));

		if (reqdCourse.length === 0) return;
		else if (!this.checkSelected(reqdCourse[0])) {
			reqdCourse = reqdCourse[0];
			reqdCourse.simple_type = 'Project';
			this.selectSlots(reqdCourse);
		}

	}

	selectSlots = (course) => {
		course.timetableName = this.state.activeTimetable
		console.log(course);

		if (course.slot !== 'NIL') {
			course.slot.replace(' ', '').split('+').map(v => this.setState(prevState => {
				let clashMap = { ...prevState.clashMap };
				clashMap[v].isFilled = true;
				return { clashMap };
			}));

			if (course.simple_type !== 'Project')
				this.checkAndSelectProject(course);
		}

		this.setState(prevState => {
			let timetable = Array.from(new Set([...prevState.timetable, course]));
			return { timetable }
			// timetable: [...prevState.timetable, course]
		}, () => {
			this.doSetSelectedCourses(this.state.timetable);
		});
	}

	unselectSlots = (course) => {
		if (course.slot !== 'NIL') {
			course.slot.replace(' ', '').split('+').map(v => this.setState(prevState => {
				let clashMap = { ...prevState.clashMap };
				clashMap[v].isFilled = false;
				return { clashMap };
			}));
		}

		this.setState(prevState => {
			let timetable = prevState.timetable.filter(v => !(course.code === v.code && course.faculty === v.faculty && course.slot === v.slot && course.venue === v.venue && v.timetableName === prevState.activeTimetable));
			return { timetable }
		}, () => {
			this.doSetSelectedCourses(this.state.timetable);
		});
	}

	selectCourse = (code) => {
		this.setState({
			selectedCourse: code
		})
	}

	changeActiveTimetable = (timetableName = 'Default') => {
		// if(timetableName === this.state.activeTimetable)
		// return;

		var slots = this.state.timetable.reduce((a, v) => {
			if (v.timetableName === timetableName && v.slot !== 'NIL')
				return [...a, ...v.slot.replace(' ', '').split('+')];
			else return a;
		}, [])

		this.setState(prevState => {
			let clashMap = { ...prevState.clashMap };
			Object.keys(clashMap).map(v => {
				if (slots.includes(v))
					clashMap[v].isFilled = true;
				else
					clashMap[v].isFilled = false;
				return v;
			})
			return { clashMap: clashMap, activeTimetable: timetableName };
		});
	}

	modifyTimetableNames = (newList) => {
		this.setState({
			timetableNames: newList
		})
	}

	doTimetableDelete = () => {
		if (this.state.activeTimetable === 'Default') return;
		this.setState(prevState => ({
			timetable: prevState.timetable.filter(v => v.timetableName !== prevState.activeTimetable),
			timetableNames: prevState.timetableNames.filter(v => v !== prevState.activeTimetable),
		}), () => {
			this.doSetSelectedCourses(this.state.timetable);
			this.changeActiveTimetable();
		});
	}

	doTimetableAdd = (newName) => {
		if (this.state.timetableNames.includes(newName)) return;

		this.setState(prevState => ({
			timetableNames: [...prevState.timetableNames, newName]
		}), () => {
			this.changeActiveTimetable(newName);
		});
	}

	doTimetableEdit = (newName) => {
		if (this.state.timetableNames.includes(newName)) return;
		if (this.state.activeTimetable === 'Default') return;

		this.setState(prevState => ({
			timetableNames: prevState.timetableNames.map(v => {
				if (v === this.state.activeTimetable)
					return newName;
				return v;
			}),

			timetable: prevState.timetable.map(v => {
				if (v.timetableName === this.state.activeTimetable) {
					v.timetableName = newName;
					return v;
				}
				return v;
			})
		}), () => {
			this.doSetSelectedCourses(this.state.timetable);
			this.changeActiveTimetable(newName);
		});
	}

	doTimetableCopy = (newName) => {
		if (this.state.timetableNames.includes(newName)) return;

		this.setState(prevState => ({
			timetableNames: [...prevState.timetableNames, newName],
			timetable: [...prevState.timetable, ...prevState.timetable.map(v => {
				if (v.timetableName === prevState.activeTimetable)
					v.timetableName = newName;
				return v;
			})]
		}), () => {
			this.doSetSelectedCourses(this.state.timetable);
			this.changeActiveTimetable(newName);
		});
	}

	updateTheme = () => {
		var theme = THEMES[this.state.activeTheme];
		localStorage.setItem('theme', this.state.activeTheme);
		Object.keys(theme.properties).map(v =>
			document.documentElement.style.setProperty(`--${v}`, theme.properties[v])
		);
	}

	changeActiveTheme = (newTheme) => {
		this.setState({ activeTheme: newTheme })
	}

	handleCurriculumChange = (val) => {
		this.doCurriculumFetch(val);
		this.setState({ selectedCurriculum: val });
	}

	genTT = (prefs) => {
		this.setState({ generatingInProcess: true });
		API.post('/ttgen/generateTimetable', { pref: prefs }).then(res => {
			if (res.data.success) {
				const tt = res.data.data;
				this.setState({ ttError: undefined });
				const newName = tt[0].timetableName;
				this.setState(prevState => ({
					timetableNames: [...prevState.timetableNames, newName],
					timetable: [...prevState.timetable, ...tt]
				}), () => {
					this.changeActiveTimetable(newName);
					this.doSetSelectedCourses(this.state.timetable);
				});
			}
			else
				this.setState({ ttError: res.data.message });
			this.setState({ generatingInProcess: false });
		}).catch(err => {
			this.setState({ generatingInProcess: false });
		});;
	}

	renderTTErrors = () => {
		if (this.state.ttError) {
			return (<Row><Alert variant='danger' onClose={() => this.setState({ ttError: undefined })} dismissible>
				<p>
					{this.state.ttError}
				</p>
			</Alert></Row>);
		}
	}

	render() {
		return (
			<Container fluid={true}>
				<Row className='navBarRow'>
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
							slots={this.filterCourse()}

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
						activeTimetable={this.state.activeTimetable}
					/>
				</Row>

				<Row>
					<SelectedCoursesTable
						timetable={this.state.timetable}
						unselectSlot={this.unselectSlots}
						activeTimetable={this.state.activeTimetable}
						creditCount={this.getCreditCount()}
					/>
				</Row>
			</Container>
		);
	}
}
export default App;
