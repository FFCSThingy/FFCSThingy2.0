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
	
	state={
		array:[{code:"Course Code",key:1,code2:"Course Title"}],i:0
	}
	
	
	addCourse=(course)=>{
		course.code2="undefined";
		let a=[...this.state.array,course];
			this.setState({
				array: a  
		});
	}
	
	
	// constructor(state) {
	// 	super(state);
	// 	this.state = {
	// 		data: {},
	// 		error: null
	// 	};
	// }

	// async componentWillMount() {
	// 	var res = await fetch("/account");
	// 	var parsed = await res.json();

	// 	if(parsed.authenticated)
	// 		this.setState({ data: parsed });
	// 	else
	// 		this.setState({ error: "Not Authenticated" });	
	// }

	render() {
		return (
			<div class="container">
			<Search addCourse={this.addCourse}/>
			<CourseSelect array={this.state.array}/>
			<SlotTable/>
			<TimeTable/>
			<CourseTable/>   
			</div>
		);
	}
}
export default App;
