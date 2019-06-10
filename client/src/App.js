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
			slotFilled: [],
			list: [],
			selectedCourse: '',
			heatmap: JSON.parse(localStorage.getItem('heatmap')) || [],
			timestamp: localStorage.getItem('heatmapTimestamp') || null,
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

	fillSlots = (slot, list) => {
		var copyList = [...this.state.list, list];
		var copyslotFilled = [...this.state.slotFilled, slot];
		this.setState({
			slotFilled: copyslotFilled,
			list: copyList
		})
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
				<SlotTable fillSlots={this.fillSlots} slots={this.filterCourse()}/>
				<TimeTable slotFilled={this.state.slotFilled} />
				<CourseTable list={this.state.list} />
			</div>
		);
	}
}
export default App;
