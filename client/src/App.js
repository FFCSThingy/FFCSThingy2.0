// 'Course' is now 'CourseSelect' to avoid confusion (left table)
// 'CourseTable' is the final bottom table for regisered courses

import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

import Search from './components/searchBar';
import CourseSelect from './components/course-select-table';
import SlotTable from './components/slotTable';
import TimeTable from './components/TimeTable';
import CourseTable from './components/coursetable';
import "whatwg-fetch";
import './App.css';
import './components/TimeTable'
import axios from 'axios';

class App extends React.Component {

	constructor(state) {
		super(state);
		this.state = {
			error: null,
			filledSlots: [],
			timetable: [],
			selectedCourse: '',
			heatmap: JSON.parse(localStorage.getItem('heatmap')) || [],
			timestamp: localStorage.getItem('heatmapTimestamp') || null,
			creditCount: 0,
			clashMap: {

			}
		};
	}

	componentDidMount() {
		axios.get("/course/getFullHeatmap")
			.then(res => {
				if (res.data.success) {
					if (res.status === 304)
						this.setState({ heatmap: JSON.parse(localStorage.getItem('heatmap')) })
					else {
						this.setState({ heatmap: res.data.data.heatmap });
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

	filterCourse() {
		return this.state.heatmap.filter(course => course.code === this.state.selectedCourse)
			.map(course => {
				if (['TH', 'ETH', 'SS'].includes(course.course_type)) course.simple_type = 'Theory';
				if (['LO', 'ELA'].includes(course.course_type)) course.simple_type = 'Lab';
				if (['PJT', 'EPJ'].includes(course.course_type)) course.simple_type = 'Project';

				return course;
			});
	}

	findAvailableCourseTypes() {
		return Array.from(new Set(
			this.filterCourse()
				.map(course => course.simple_type)
		)).sort();
	}

	findAvailableVenues(type = null) {
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



	selectSlots = (course) => {
		if (course.slot !== 'NIL')
			this.setState(prevState => ({
				filledSlots: [...prevState.filledSlots, ...course.slot.split("+")],
				timetable: [...prevState.timetable, course],
				creditCount: prevState.creditCount + course.credits
			}));
		else
			this.setState(prevState => ({
				timetable: [...prevState.timetable, course],
				creditCount: prevState.creditCount + course.credits
			}));
	}

	selectCourse = (code) => {
		this.setState({
			selectedCourse: code
		})
	}

	render() {
		return (
			<Container fluid={true}>
				<Row>
					<p>Selected Course: {this.state.selectedCourse}</p>
				</Row>

				<Row>
					<Search addCourse={this.addCourse} />
				</Row>

				<Row>
					<Col xs={12} md={4}>
						<CourseSelect selectCourse={this.selectCourse} />
					</Col>

					<Col xs={12} md={8}>
						<SlotTable
							selectSlots={this.selectSlots}
							slots={this.filterCourse()}
							types={this.findAvailableCourseTypes()}
							venues={this.findAvailableVenues()}
							theoryVenues={this.findAvailableVenues('Theory')}
							labVenues={this.findAvailableVenues('Lab')}
							projectVenues={this.findAvailableVenues('Project')}
						/>
					</Col>
				</Row>

				<Row>
					<TimeTable 
						filledSlots={this.state.filledSlots} 
						timetable={this.state.timetable} 
					/>
				</Row>

				<Row>
					<CourseTable
						timetable={this.state.timetable}
						creditCount={this.state.creditCount}
					/>
				</Row>
			</Container>
		);
	}
}
export default App;
