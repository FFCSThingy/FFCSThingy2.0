import React, { Component } from "react";
import "whatwg-fetch";
// Removed logo since we don't need it anymore
import "./App.css";
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
				<p>{ this.state.data.display_name }</p>
				<img src={ this.state.data.picture }></img>

				<p>{ this.state.error }</p>
			</div>
		);
	}
}
export default App;
