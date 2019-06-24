// 'Course' is now 'CourseSelect' to avoid confusion (left table)
// 'CourseTable' is the final bottom table for regisered courses

import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

import CourseSelect from './components/course-select-table';
import SlotTable from './components/slotTable';
import TimeTable from './components/TimeTable';
import CourseTable from './components/coursetable';
import SelectTimeTable from './components/selectTimeTable';
import CustomNavbar from './components/CustomNavbar';

import "whatwg-fetch";
import './App.css';
import './css/nav-bar.css'
import './components/TimeTable'

import API from './API';
import Generator from './components/magicFill';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-121295619-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends React.Component {

	constructor(state) {
		super(state);
		this.state = {
			error: null,
			activeTimetable: 'Default',
			generatingInProcess:false,
			user: {},
			submitted_regno: '',

			timetable: [],
			timetableTimestamp: localStorage.getItem('timetableTimestamp') || null,
			timetableNames: ['Default'],

			courseList: JSON.parse(localStorage.getItem('courseList')) || [],
			timestamp: localStorage.getItem('courseListTimestamp') || null,
			selectedCourse: '',
			completedCourses: {},

			heatmap: JSON.parse(localStorage.getItem('heatmap')) || [],
			heatmapTimestamp: localStorage.getItem('heatmapTimestamp') || null,

			curriculumList: ['Curriculum'],
			curriculum: localStorage.getItem(localStorage.getItem('selectedCurriculum')) || {},
			selectedCurriculum: localStorage.getItem('selectedCurriculum') || 'Curriculum',

			activeTheme: localStorage.getItem('theme') || 'default',
			themes: {
				default: {
					name: 'Default',
					properties: {
						'brand-color': '#7c87e8',
						'body-background-color': '#C3D1F5',
						'select-table-background-color': '#f6f6f6',
						'card-background-color': '#ffffff',
						'card-highlight-color': '#ECEBFE',
						'button-highlight-color': '#36e2a8',
						'timetable-theory-color': '#FFDCB5',
						'timetable-lab-color': '#99D1FF',
						'timetable-col1-color': '#e5e5e5',
						'text-color-default': '#ffffff',
						'text-color-inverted': '#000000',
						'text-color-other': '#666666',
						'card-clash-text-color': '#ff6961',
						'card-selected-text-color': '#00b200',
						'dropdown-border-color': '#4c56b2',
						'dropshadow-default': '#00000033',
						'dropshadow-highlight': '#00000059',
						'alternate-table-item-color': '#ECEBFE',
					}
				},
				dark: {
					name: 'Eerie Black',
					properties: {
						'brand-color': '#121317',
						'body-background-color': '#15181f',
						'select-table-background-color': '#1f2229',
						'card-background-color': '#27282C',
						'card-highlight-color': '#4993D0',
						'button-highlight-color': '#36e2a8',
						'timetable-theory-color': '#6B4896',
						'timetable-lab-color': '#008C7E',
						'timetable-col1-color': '#121317',
						'text-color-default': '#ffffff',
						'text-color-inverted': '#ffffff',
						'text-color-other': '#ffffff',
						'card-clash-text-color': '#ff6961',
						'card-selected-text-color': '#ffffff',
						'dropdown-border-color': '#1f2229',
						'dropshadow-default': '#00000033',
						'dropshadow-highlight': '#000000',
						'alternate-table-item-color': '#1f2229',
					}
				},
				yellowish: {
					name: 'Mellow Yellow',
					properties: {
						'brand-color': '#FFDA76',
						'body-background-color': '#FFECC5',
						'select-table-background-color': '#f6f6f6',
						'card-background-color': '#ffffff',
						'card-highlight-color': '#FFFAE9',
						'button-highlight-color': '#36e2a8',
						'timetable-theory-color': '#FFDCB5',
						'timetable-lab-color': '#99D1FF',
						'timetable-col1-color': '#e5e5e5',
						'text-color-default': '#2F4F4F',
						'text-color-inverted': '#2F4F4F',
						'text-color-other': '#666666',
						'card-clash-text-color': '#ff6961',
						'card-selected-text-color': '#00b200',
						'dropdown-border-color': '#FFD156',
						'dropshadow-default': '#00000033',
						'dropshadow-highlight': '#00000059',
						'alternate-table-item-color': '#FFFAE9',
					}
				},
				coral: {
					name: 'Light Coral',
					properties: {
						'brand-color': '#E87A85',
						'body-background-color': '#F4C3D1',
						'select-table-background-color': '#f6f6f6',
						'card-background-color': '#ffffff',
						'card-highlight-color': '#FFEDED',
						'button-highlight-color': '#36e2a8',
						'timetable-theory-color': '#FFDCB5',
						'timetable-lab-color': '#99D1FF',
						'timetable-col1-color': '#e5e5e5',
						'text-color-default': '#ffffff',
						'text-color-inverted': '#000000',
						'text-color-other': '#666666',
						'card-clash-text-color': '#ff6961',
						'card-selected-text-color': '#00b200',
						'dropdown-border-color': '#B24C56',
						'dropshadow-default': '#00000033',
						'dropshadow-highlight': '#00000059',
						'alternate-table-item-color': '#FFEDED',
					}
				},
				green: {
					name: 'Pretty Green',
					properties: {
						'brand-color': '#7AE88B',
						'body-background-color': '#C6F4C3',
						'select-table-background-color': '#f6f6f6',
						'card-background-color': '#ffffff',
						'card-highlight-color': '#EDFFF2',
						'button-highlight-color': '#f4c2c6',
						'timetable-theory-color': '#FFDCB5',
						'timetable-lab-color': '#99D1FF',
						'timetable-col1-color': '#e5e5e5',
						'text-color-default': '#2F4F4F',
						'text-color-inverted': '#000000',
						'text-color-other': '#666666',
						'card-clash-text-color': '#ff6961',
						'card-selected-text-color': '#00b200',
						'dropdown-border-color': '#4CB25C',
						'dropshadow-default': '#00000033',
						'dropshadow-highlight': '#00000059',
						'alternate-table-item-color': '#EDFFF2',
					}
				},
				blue: {
					name: 'Devspace Light',
					properties: {
						'brand-color': '#7AD7E8',
						'body-background-color': '#C3F4F2',
						'select-table-background-color': '#f6f6f6',
						'card-background-color': '#ffffff',
						'card-highlight-color': '#EDF9FF',
						'button-highlight-color': '#36e2a8',
						'timetable-theory-color': '#FFDCB5',
						'timetable-lab-color': '#99D1FF',
						'timetable-col1-color': '#e5e5e5',
						'text-color-default': '#2F4F4F',
						'text-color-inverted': '#000000',
						'text-color-other': '#666666',
						'card-clash-text-color': '#ff6961',
						'card-selected-text-color': '#00b200',
						'dropdown-border-color': '#1d98ae',
						'dropshadow-default': '#00000033',
						'dropshadow-highlight': '#00000059',
						'alternate-table-item-color': '#EDF9FF',
					}
				},
				pink: {
					name: 'Persian Pink',
					properties: {
						'brand-color': '#E87ABC',
						'body-background-color': '#F4C3E9',
						'select-table-background-color': '#f6f6f6',
						'card-background-color': '#ffffff',
						'card-highlight-color': '#FFEDF4',
						'button-highlight-color': '#36e2a8',
						'timetable-theory-color': '#FFDCB5',
						'timetable-lab-color': '#99D1FF',
						'timetable-col1-color': '#e5e5e5',
						'text-color-default': '#ffffff',
						'text-color-inverted': '#000000',
						'text-color-other': '#666666',
						'card-clash-text-color': '#ff6961',
						'card-selected-text-color': '#00b200',
						'dropdown-border-color': '#B24C89',
						'dropshadow-default': '#00000033',
						'dropshadow-highlight': '#00000059',
						'alternate-table-item-color': '#FFEDF4',
					}
				}
			},

			clashMap: {
				A1: {
					clashesWith: ['A1', 'L1', 'L2', 'L13', 'L14'],
					isFilled: false
				},
				B1: {
					clashesWith: ['B1', 'L7', 'L8', 'L19', 'L20'],
					isFilled: false
				},
				C1: {
					clashesWith: ['C1', 'L13', 'L14', 'L25', 'L26'],
					isFilled: false
				},
				D1: {
					clashesWith: ['D1', 'L19', 'L20', 'L3', 'L4'],
					isFilled: false
				},
				E1: {
					clashesWith: ['E1', 'L25', 'L26', 'L9', 'L10'],
					isFilled: false
				},
				F1: {
					clashesWith: ['F1', 'L1', 'L2', 'L15', 'L16'],
					isFilled: false
				},
				G1: {
					clashesWith: ['G1', 'L7', 'L8', 'L21', 'L22'],
					isFilled: false
				},
				TA1: {
					clashesWith: ['TA1', 'L27', 'L28'],
					isFilled: false
				},
				TB1: {
					clashesWith: ['TB1', 'L4', 'L5'],
					isFilled: false
				},
				TC1: {
					clashesWith: ['TC1', 'L10', 'L11'],
					isFilled: false
				},
				TE1: {
					clashesWith: ['TE1', 'L22', 'L23'],
					isFilled: false
				},
				TF1: {
					clashesWith: ['TF1', 'L28', 'L29'],
					isFilled: false
				},
				TG1: {
					clashesWith: ['TG1', 'L5', 'L6'],
					isFilled: false
				},
				TAA1: {
					clashesWith: ['TAA1', 'L11', 'L12'],
					isFilled: false
				},
				TCC1: {
					clashesWith: ['TCC1', 'L23', 'L24'],
					isFilled: false
				},
				TD1: {
					clashesWith: ['TD1', 'L29', 'L30'],
					isFilled: false
				},


				A2: {
					clashesWith: ['A2', 'L31', 'L32', 'L43', 'L44'],
					isFilled: false
				},
				B2: {
					clashesWith: ['B2', 'L37', 'L38', 'L49', 'L50'],
					isFilled: false
				},
				C2: {
					clashesWith: ['C2', 'L43', 'L44', 'L55', 'L56'],
					isFilled: false
				},
				D2: {
					clashesWith: ['D2', 'L49', 'L50', 'L33', 'L34'],
					isFilled: false
				},
				E2: {
					clashesWith: ['E2', 'L55', 'L56', 'L39', 'L40'],
					isFilled: false
				},
				F2: {
					clashesWith: ['F2', 'L31', 'L32', 'L45', 'L46'],
					isFilled: false
				},
				G2: {
					clashesWith: ['G2', 'L37', 'L38', 'L51', 'L52'],
					isFilled: false
				},
				TA2: {
					clashesWith: ['TA2', 'L57', 'L58'],
					isFilled: false
				},
				TB2: {
					clashesWith: ['TB2', 'L34', 'L35'],
					isFilled: false
				},
				TC2: {
					clashesWith: ['TC2', 'L40', 'L41'],
					isFilled: false
				},
				TD2: {
					clashesWith: ['TD2', 'L46', 'L47'],
					isFilled: false
				},
				TE2: {
					clashesWith: ['TE2', 'L52', 'L53'],
					isFilled: false
				},
				TF2: {
					clashesWith: ['TF2', 'L58', 'L59'],
					isFilled: false
				},
				TG2: {
					clashesWith: ['TG2', 'L35', 'L36'],
					isFilled: false
				},
				TAA2: {
					clashesWith: ['TAA2', 'L41', 'L42'],
					isFilled: false
				},
				TBB2: {
					clashesWith: ['TBB2', 'L47', 'L48'],
					isFilled: false
				},
				TCC2: {
					clashesWith: ['TCC2', 'L53', 'L54'],
					isFilled: false
				},
				TDD2: {
					clashesWith: ['TD2', 'L59', 'L60'],
					isFilled: false
				},


				L1: {
					clashesWith: ['L1', 'A1'],
					isFilled: false
				},
				L2: {
					clashesWith: ['L2', 'F1'],
					isFilled: false
				},
				L3: {
					clashesWith: ['L3', 'D1'],
					isFilled: false
				},
				L4: {
					clashesWith: ['L4', 'TB1'],
					isFilled: false
				},
				L5: {
					clashesWith: ['L5', 'TG1', 'TB1'],
					isFilled: false
				},
				L6: {
					clashesWith: ['L6'],
					isFilled: false
				},
				L7: {
					clashesWith: ['L7', 'B1'],
					isFilled: false
				},
				L8: {
					clashesWith: ['L8', 'G1'],
					isFilled: false
				},
				L9: {
					clashesWith: ['L9', 'E1'],
					isFilled: false
				},
				L10: {
					clashesWith: ['L10', 'TC1'],
					isFilled: false
				},

				L11: {
					clashesWith: ['L11', 'TAA1', 'TC1'],
					isFilled: false
				},
				L12: {
					clashesWith: ['L12'],
					isFilled: false
				},
				L13: {
					clashesWith: ['L13', 'C1'],
					isFilled: false
				},
				L14: {
					clashesWith: ['L14', 'A1'],
					isFilled: false
				},
				L15: {
					clashesWith: ['L15', 'F1'],
					isFilled: false
				},
				L16: {
					clashesWith: ['L16', 'V1'],
					isFilled: false
				},
				L19: {
					clashesWith: ['L19', 'D1'],
					isFilled: false
				},
				L20: {
					clashesWith: ['L20', 'B1'],
					isFilled: false
				},

				L21: {
					clashesWith: ['L21', 'G1'],
					isFilled: false
				},
				L22: {
					clashesWith: ['L22', 'TE1'],
					isFilled: false
				},
				L23: {
					clashesWith: ['L23', 'TCC1', 'TE1'],
					isFilled: false
				},
				L24: {
					clashesWith: ['L24'],
					isFilled: false
				},
				L25: {
					clashesWith: ['L25', 'E1'],
					isFilled: false
				},
				L26: {
					clashesWith: ['L26', 'C1'],
					isFilled: false
				},
				L27: {
					clashesWith: ['L27', 'TA1'],
					isFilled: false
				},
				L28: {
					clashesWith: ['L28', 'TF1'],
					isFilled: false
				},
				L29: {
					clashesWith: ['L29', 'TD1', 'TF1'],
					isFilled: false
				},
				L30: {
					clashesWith: ['L30'],
					isFilled: false
				},


				L31: {
					clashesWith: ['L31', 'A2'],
					isFilled: false
				},
				L32: {
					clashesWith: ['L32', 'F2'],
					isFilled: false
				},
				L33: {
					clashesWith: ['L33', 'D2'],
					isFilled: false
				},
				L34: {
					clashesWith: ['L34', 'TB2'],
					isFilled: false
				},
				L35: {
					clashesWith: ['L35', 'TG2', 'TB2'],
					isFilled: false
				},
				L36: {
					clashesWith: ['L36', 'TG2'],
					isFilled: false
				},
				L37: {
					clashesWith: ['L37', 'B2'],
					isFilled: false
				},
				L38: {
					clashesWith: ['L38', 'G2'],
					isFilled: false
				},
				L39: {
					clashesWith: ['L39', 'E2'],
					isFilled: false
				},
				L40: {
					clashesWith: ['L40', 'TC2'],
					isFilled: false
				},

				L41: {
					clashesWith: ['L41', 'TAA2', 'TC2'],
					isFilled: false
				},
				L42: {
					clashesWith: ['L42', 'TAA2'],
					isFilled: false
				},
				L43: {
					clashesWith: ['L43', 'C2'],
					isFilled: false
				},
				L44: {
					clashesWith: ['L44', 'A2'],
					isFilled: false
				},
				L45: {
					clashesWith: ['L45', 'F2'],
					isFilled: false
				},
				L46: {
					clashesWith: ['L46', 'TD2'],
					isFilled: false
				},
				L47: {
					clashesWith: ['L47', 'TD2', 'TBB2'],
					isFilled: false
				},
				L48: {
					clashesWith: ['L48', 'TBB2'],
					isFilled: false
				},
				L49: {
					clashesWith: ['L49', 'D2'],
					isFilled: false
				},
				L50: {
					clashesWith: ['L50', 'B2'],
					isFilled: false
				},

				L51: {
					clashesWith: ['L51', 'G2'],
					isFilled: false
				},
				L52: {
					clashesWith: ['L52', 'TE2'],
					isFilled: false
				},
				L53: {
					clashesWith: ['L53', 'TCC2', 'TE2'],
					isFilled: false
				},
				L54: {
					clashesWith: ['L54', 'TCC2'],
					isFilled: false
				},
				L55: {
					clashesWith: ['L55', 'E2'],
					isFilled: false
				},
				L56: {
					clashesWith: ['L56', 'C2'],
					isFilled: false
				},
				L57: {
					clashesWith: ['L57', 'TA2'],
					isFilled: false
				},
				L58: {
					clashesWith: ['L58', 'TF2'],
					isFilled: false
				},
				L59: {
					clashesWith: ['L59', 'TDD2', 'TF2'],
					isFilled: false
				},
				L60: {
					clashesWith: ['L60', 'TDD2'],
					isFilled: false
				},


				V1: {
					clashesWith: ['V1', 'L16'],
					isFilled: false
				},
				V2: {
					clashesWith: ['V2'],
					isFilled: false
				},
				V3: {
					clashesWith: ['V3'],
					isFilled: false
				},
				V4: {
					clashesWith: ['V4'],
					isFilled: false
				},
				V5: {
					clashesWith: ['V5'],
					isFilled: false
				},
				V6: {
					clashesWith: ['V6'],
					isFilled: false
				},
				V7: {
					clashesWith: ['V7'],
					isFilled: false
				},

			}
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.activeTheme !== prevState.activeTheme)
			this.updateTheme();
	}

	componentDidMount() {
		this.updateTheme();
		this.doGetAccount();
		this.doGetSelectedCourses();
		this.doGetCourseList();
		this.doGetFullHeatmap();
		this.doGetPrefixes();
		this.doCurriculumFetch(this.state.selectedCurriculum);
		this.changeActiveTimetable();
		this.doGetTimetableNames();

		this.heatmapInterval = setInterval(() => this.doGetFullHeatmap(), 1000*2*60);
		this.courseSyncInterval = setInterval(() => this.doGetSelectedCourses(), 1000*60);
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
				if(err.response.status === 401) this.handleUnauth();
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
					if(names.length === 0) names = ['Default'];
					this.setState({timetableNames: names});
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
		if(prefix === 'Curriculum') {
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

	doGetCourseList = () => {
		// API.get("/course/newCourseList")
		API.get("/course/courseList")
			.then(res => {
				if (res.data.success) {
					if (res.status === 304) {
						var courses = JSON.parse(localStorage.getItem('courseList'));
						this.setState({ courseList: courses });
					}
					else {
						this.setState({ courseList: res.data.data.courseList });
						localStorage.setItem('courseListTimestamp', res.data.data.timestamp);
						localStorage.setItem('courseList', JSON.stringify(res.data.data.courseList));
					}
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
		API.post('/user/selectedCoursesBulk', {selected_courses: timetable}).then(res => {
		}).catch(err => {
			if (err.response.status === 401) this.handleUnauth();
		});;
	}

	filterCourse = () => {
		return this.state.heatmap.filter(course => course.code === this.state.selectedCourse)
			.map(course => {
				if (['TH', 'ETH', 'SS'].includes(course.course_type)) course.simple_type = 'Theory';
				if (['LO', 'ELA'].includes(course.course_type)) course.simple_type = 'Lab';
				if (['PJT', 'EPJ'].includes(course.course_type)) course.simple_type = 'Project';

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
		var count = this.state.timetable.reduce((a,v) => {
			if (v.timetableName === this.state.activeTimetable)
				return a + Number(v.credits);
			return a;
		}, 0)

		if(!count) return 0;
		return count;
	}

	checkClash = (slot) => {
		var filledSlots = this.getFilledSlots();
		if (slot === 'NIL') return false;
		if (filledSlots.length === 0) return false;

		return filledSlots.map(v => {
			return slot.split('+')
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
			course.slot.split('+').map(v => this.setState(prevState => {
				let clashMap = { ...prevState.clashMap };
				clashMap[v].isFilled = true;
				return { clashMap };
			}));

			if (course.simple_type !== 'Project')
				this.checkAndSelectProject(course);
		}

		this.setState(prevState => {
			let timetable = [...prevState.timetable, course];
			this.doSetSelectedCourses(timetable);
			return { timetable }
			// timetable: [...prevState.timetable, course]
		});
	}

	unselectSlots = (course) => {
		course.timetableName = this.state.activeTimetable
		if (course.slot !== 'NIL') {
			course.slot.split('+').map(v => this.setState(prevState => {
				let clashMap = { ...prevState.clashMap };
				clashMap[v].isFilled = false;
				return { clashMap };
			}));
		}

		this.setState(prevState => {
			let timetable = prevState.timetable.filter(v => !(course.code === v.code && course.faculty === v.faculty && course.slot === v.slot && course.venue === v.venue && course.timetableName === prevState.activeTimetable));

			this.doSetSelectedCourses(timetable);
			return { timetable }
		});
	}

	selectCourse = (code) => {
		this.setState({
			selectedCourse: code
		})
	}

	changeActiveTimetable = (timetableName='Default') => {
		// if(timetableName === this.state.activeTimetable)
			// return;

		var slots = this.state.timetable.reduce((a, v) => {
			if (v.timetableName === timetableName && v.slot !== 'NIL')
				return [...a, ...v.slot.split('+')];
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
		if(this.state.activeTimetable === 'Default') return;
		this.setState(prevState => ({
			timetable: prevState.timetable.filter(v => v.timetableName !== prevState.activeTimetable),
			timetableNames: prevState.timetableNames.filter(v => v !== prevState.activeTimetable),
		}), () => {
			this.changeActiveTimetable();
		});
	}

	doTimetableAdd = (newName) => {
		if(this.state.timetableNames.includes(newName)) return;

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
				if(v === this.state.activeTimetable)
					return newName;
				return v;
			}),

			timetable: prevState.timetable.map(v => {
				if(v.timetableName === this.state.activeTimetable) {
					v.timetableName = newName;
					return v;
				}
				return v;
			})
		}), () => {
			this.changeActiveTimetable(newName);
		});
	}

	doTimetableCopy = (newName) => {
		if (this.state.timetableNames.includes(newName)) return;

		this.setState(prevState => ({
			timetableNames: [...prevState.timetableNames, newName],
			timetable: [...prevState.timetable, ...prevState.timetable.map(v => {
				if(v.timetableName === prevState.activeTimetable)
					v.timetableName = newName;
				return v;
			})]
		}), () => {
				this.changeActiveTimetable(newName);
		});
	}

	updateTheme = () => {
		var theme = this.state.themes[this.state.activeTheme];
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
		this.setState({generatingInProcess:true});
		API.post('/ttgen/generateTimetable', {pref: prefs}).then(res => {
			if (res.data.success) {
				const tt = res.data.data;
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
				this.setState({ error: res.data.message });
			this.setState({generatingInProcess:false});
		}).catch(err => {
			this.setState({generatingInProcess:false});
		});;
	}

	render() {
		return (
			<Container fluid={true}>
				<Row className='navBarRow'>
					<CustomNavbar
						user={this.state.user}
						creditCount={this.getCreditCount()}
						themes={this.state.themes}
						curriculumList={this.state.curriculumList}
						selectedCurriculum={this.state.selectedCurriculum}

						handleCurriculumChange={this.handleCurriculumChange}
						changeActiveTheme={this.changeActiveTheme}
						doLogout={this.doLogout}
					/>
				</Row>

				<Row className="slotSelectionRow">
					<Col xs={12} md={4}>
						<CourseSelect
							selectCourse={this.selectCourse}

							courseList={this.state.courseList}
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
				<Row>
					<Generator
						user={this.state.user}
						inProcess={this.state.generatingInProcess}
						genTT={(prefs) => {this.genTT(prefs)}}
					/>
				</Row>
					<Row>
					<Col>
						<SelectTimeTable
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
					<TimeTable
						clashMap={this.state.clashMap}
						filledSlots={this.getFilledSlots()}
						timetable={this.state.timetable}
						activeTimetable={this.state.activeTimetable}
					/>
				</Row>

				<Row>
					<CourseTable
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
