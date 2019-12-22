import React from 'react';
import {
	Redirect, Route, BrowserRouter as Router, Switch,
} from 'react-router-dom';

import API from './API';

import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

class App extends React.Component {
	unauthRedirect = (<Redirect to="/" />);

	constructor(props) {
		super(props);
		this.state = {
			authenticated: true,
		};
	}

	componentDidMount() {
		this.isAuthenticated();
	}

	handleUnauth = () => this.setState({
		authenticated: false,
	});

	isAuthenticated = () => API.get('/account')
		.then((res) => {
			this.setState({
				authenticated: !!res.data,
			});
		})
		.catch((err) => {
			this.setState({
				authenticated: !err,
			});
		})

	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={Login} />
					<PrivateRoute
						path="/dashboard"
						redirect="/"
						component={Dashboard}
						isAuthenticated={this.state.authenticated}
						handleUnauth={this.handleUnauth}
					/>
				</Switch>
			</Router>
		);
	}
}
export default App;
