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
			selectedCourse: ''
		};
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
				<SlotTable fillSlots={this.fillSlots} selectedCourse={this.state.selectedCourse} />
				<TimeTable slotFilled={this.state.slotFilled} />
				<CourseTable list={this.state.list} />
			</div>
		);
	}
}
export default App;
