import React, { Component } from 'react';
// Removed logo since we don't need it anymore
import './App.css';
import './components/TimeTable'
import TimeTable from './components/TimeTable';
class App extends Component {
	render() {
		return (
			<div className="container">
				<h1>Hello World!</h1>
				<p>I just created my first React App</p>
				<TimeTable/>
			</div>
		);
	}
}
export default App;