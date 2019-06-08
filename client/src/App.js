/*Components Merged
constructor function(line 33) is commented for now.
gives error when enabled.
*/

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

class App extends React.Component {

	constructor(state) {
		super(state);
		this.state = {
			courseList: [],
			error: null
		};
	}

	async componentWillMount() {
		var res = await fetch("/course/getCourseList");
		var parsed = await res.json();

		if (parsed.success)
			this.setState({ courseList: parsed.data });
		else
			this.setState({ error: parsed.message });
	}

	render() {
		return (
			<div class="container">
				<Search addCourse={this.addCourse} />
				<CourseSelect courses={this.state.courseList} />
				<SlotTable />
				<TimeTable />
				<CourseTable />
			</div>
		);
	}
}
export default App;
