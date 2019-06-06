/*Components Merged
constructor function(line 33) is commented for now.
gives error when enabled.
*/

import React from 'react';
import Search from './components/searchBar';
import Course from './components/course.js';
//import Table from './components/table';
import CourseTable from './components/coursetable';
import "whatwg-fetch";
// Removed logo since we don't need it anymore
import './App.css';
import './components/TimeTable'
import TimeTable from './components/TimeTable';
import SlotTable from './components/slotTable';
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
			<div>
			<Search addCourse={this.addCourse}/>
			<Course array={this.state.array}/>
			<SlotTable/>
			<TimeTable/>
			<CourseTable/>   
			</div>
		);
	}
}
export default App;
