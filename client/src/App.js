import React, { Component } from "react";
import "whatwg-fetch";
// Removed logo since we don't need it anymore
import './App.css';
import './components/TimeTable'
import TimeTable from './components/TimeTable';
class App extends Component {
	constructor(state) {
		super(state);
		this.state = {
			data: {},
			error: null
		};
	}

	async componentWillMount() {
		var res = await fetch("/account");
		var parsed = await res.json();

		if(parsed.authenticated)
			this.setState({ data: parsed });
		else
			this.setState({ error: "Not Authenticated" });	
	}

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
