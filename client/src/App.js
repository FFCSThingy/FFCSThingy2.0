import React, { Component } from 'react';
import 'whatwg-fetch';
// Removed logo since we don't need it anymore
import './App.css';
class App extends Component {
	constructor() {
		super();
		this.state = {
			data: null,
			error: null
		};
		// this.loadAccountDetailsFromServer();
	}

	componentWillMount() {
		this.loadAccountDetailsFromServer();
	}

	loadAccountDetailsFromServer = () => {
		fetch('/account')
			.then(data => data.json())
			.then((res) => {
				if (!res.success) this.setState({ error: res.error });
				else this.setState({ data: res.display_name });
			});
	}
	
	render() {
		return (
			<div className="container">
				<h1>Hello World!</h1>
				<p>I just created my first React App</p>
				<p>{ this.state.data }</p>
			</div>
		);
	}
}
export default App;