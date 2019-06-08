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
			courseList: [],
			error: null,
			slotFilled: [],
			list: [],
			selectedCourse: ''
		};
	}

	async componentWillMount() {
		axios.get("/course/getCourseList")
			.then(res => {
				if (res.data.success)
					this.setState({ courseList: res.data.data })
				else {
					this.setState({ error: res.data.message })
				}
			})
		// var res = await fetch("/course/getCourseList");
		// var parsed = await res.json();

		// if (parsed.success)
		// 	this.setState({ courseList: parsed.data });

		// else{
		// 	this.setState({ error: parsed.message});
		//}
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
				<CourseSelect courses={this.state.courseList} selectCourse={this.selectCourse} />
				<SlotTable fillSlots={this.fillSlots} selectedCourse={this.state.selectedCourse} />
				<TimeTable slotFilled={this.state.slotFilled} />
				<CourseTable list={this.state.list} />
			</div>
		);
	}
}
export default App;
