// 'Course' is now 'CourseSelect' to avoid confusion (left table)
// 'CourseTable' is the final bottom table for regisered courses

import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Navbar, Nav, NavDropdown, Form, FormControl, Button, Dropdown, NavbarBrand } from 'react-bootstrap';

import CourseSelect from './components/course-select-table';
import SlotTable from './components/slotTable';
import TimeTable from './components/TimeTable';
import CourseTable from './components/coursetable';
import "whatwg-fetch";
import './App.css';
import './css/nav-bar.css'
import './components/TimeTable'

import navbarImage from './images/logo.png';

import axios from 'axios';
import Generator from './components/magicFill';

class App extends React.Component {

	constructor(state) {
		super(state);
		this.state = {
			error: null,
			activeTimetable: 'Default',

			user: {},

			timetable: [],
			creditCount: 0,

			selectedCourse: '',

			heatmap: JSON.parse(localStorage.getItem('heatmap')) || [],
			heatmapTimestamp: localStorage.getItem('heatmapTimestamp') || null,

			clashMap: {
				A1: {
					clashesWith: ['A1', 'L1', 'L2', 'L14', 'L15'],
					isFilled: false
				},
				B1: {
					clashesWith: ['B1', 'L7', 'L8', 'L20', 'L21'],
					isFilled: false
				},
				C1: {
					clashesWith: ['C1', 'L13', 'L14', 'L26', 'L27'],
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
					clashesWith: ['F1', 'L2', 'L3', 'L15', 'L16'],
					isFilled: false
				},
				G1: {
					clashesWith: ['G1', 'L8', 'L9', 'L21', 'L22'],
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
					clashesWith: ['A2', 'L31', 'L32', 'L44', 'L45'],
					isFilled: false
				},
				B2: {
					clashesWith: ['B2', 'L37', 'L38', 'L50', 'L51'],
					isFilled: false
				},
				C2: {
					clashesWith: ['C2', 'L43', 'L44', 'L56', 'L57'],
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
					clashesWith: ['F2', 'L32', 'L33', 'L45', 'L46'],
					isFilled: false
				},
				G2: {
					clashesWith: ['G2', 'L38', 'L39', 'L51', 'L52'],
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

	componentDidMount() {
		axios.get("/account")
			.then(res => {
				if (res.data) {
					if (res.status === 304);
					// this.setState({ heatmap: JSON.parse(localStorage.getItem('heatmap')) })
					else if (res.status === 301) { } // Do Logout
					else {
						this.setState({ user: res.data });
					}
				} else
					this.setState({ error: res.data.message })
			}).catch(err => {
				console.log(err);
				this.setState({ error: err })
			});

		axios.get("/course/getFullHeatmap")
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
				console.log(err);
				this.setState({ error: err })
			});
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
		return this.state.timetable.reduce((a, v) => a || (course.code === v.code && course.faculty === v.faculty && course.slot === v.slot && course.venue === v.venue && course.timetableName === this.state.activeTimetable), false)
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

		this.setState(prevState => ({
			timetable: [...prevState.timetable, course],
			creditCount: prevState.creditCount + course.credits
		}));
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

		this.setState(prevState => ({
			timetable: prevState.timetable.filter(v => !(
				course.code === v.code && course.faculty === v.faculty && course.slot === v.slot && course.venue === v.venue && course.timetableName === prevState.activeTimetable
			)
			),
			creditCount: prevState.creditCount - course.credits,
		}));
	}

	selectCourse = (code) => {
		this.setState({
			selectedCourse: code
		})
	}

	renderNavbar = () => {
		return (
			<Navbar className="navBar" bg="light" fixed="top" expand="md">
				<NavbarBrand href="#home" class="navbar-left">
					{/* <img className="logo" alt="FFCSThingy" src={navbarImage}></img> */}
					FFCSThingy
				</NavbarBrand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse className="linksContainer" id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link className="navLink">Home</Nav.Link>
						<Nav.Link className="navLink">About</Nav.Link>
					</Nav>

					<Nav className="navLeft">	
						<Nav.Link className="navLink" disabled>
							Credits: {this.state.creditCount}
						</Nav.Link>
						<NavDropdown title="Profile" className="navDropContainer">
							<NavDropdown.Item disabled>{this.state.user.display_name}</NavDropdown.Item>
							<NavDropdown.Item disabled>{this.state.user.picture}</NavDropdown.Item>
							<NavDropdown.Item>Logout</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	}

	render() {
		return (
			<Container fluid={true}>
				<Row className='navBarRow'>
					{this.renderNavbar()}
				</Row>

				<Row>
					<Col xs={12} md={4}>
						<CourseSelect
							selectCourse={this.selectCourse}
							heatmap={this.state.heatmap}
							selectedCourse={this.state.selectedCourse}
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
					<Generator/>
				</Row>
				<Row>
					<TimeTable
						filledSlots={this.getFilledSlots()}
						timetable={this.state.timetable}
					/>
				</Row>
				
				<Row>
					<CourseTable
						timetable={this.state.timetable}
						creditCount={this.state.creditCount}
						unselectSlot={this.unselectSlots}
					/>
				</Row>
			</Container>
		);
	}
}
export default App;
