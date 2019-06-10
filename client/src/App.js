// 'Course' is now 'CourseSelect' to avoid confusion (left table)
// 'CourseTable' is the final bottom table for regisered courses

import React from 'react';
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
					if (res.status == 304)
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
		return this.state.heatmap.filter(course => course.code === this.state.selectedCourse);
	}

	findAvailableCourseTypes() {
		return new Set(
			this.filterCourse()
				.map(course => {
					if (['TH', 'ETH', 'SS'].includes(course.course_type)) return 'Theory'
					if (['LO', 'ELA'].includes(course.course_type)) return 'Lab'
					if (['PJT', 'EPJ'].includes(course.course_type)) return 'Project'
				})
		);
	}

	findAvailableVenues(type=null) {
		var venueRegex = /^[A-Z]+/;
		return new Set(
			this.filterCourse()
				.filter(c => !(c.venue === 'NIL'))
				.filter(c => {
					if(!type) return true; 
					return c.type === type
				})
				.map(course => course.venue.match(venueRegex)[0])
		);
	}



	selectSlots = (course) => {
		if(course.slot !== 'NIL')
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
			<div class="container">
				<p>Selected Course: {this.state.selectedCourse}</p>
				<Search addCourse={this.addCourse} />
				<CourseSelect selectCourse={this.selectCourse} />

				<SlotTable 
					selectSlots={this.selectSlots} 
					slots={this.filterCourse()} 
					types={this.findAvailableCourseTypes()}
					theoryVenues={this.findAvailableVenues('Theory')}
					labVenues={this.findAvailableVenues('Lab')}
					projectVenues={this.findAvailableVenues('Project')}
				/>
				
				<TimeTable filledSlots={this.state.filledSlots} timetable={this.state.timetable}/>
				<CourseTable 
					timetable={ this.state.timetable } 
					creditCount={ this.state.creditCount }
				/>
			</div>
		);
	}
}
export default App;
