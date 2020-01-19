import React, { useEffect, useState } from 'react';
import {
	Route, BrowserRouter as Router, Switch,
} from 'react-router-dom';

import API from './API';

import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
	const [authenticated, setAuthenticated] = useState(true);

	const isAuthenticated = () => API.get('/account')
		.then((res) => setAuthenticated(!!res.data))
		.catch((err) => setAuthenticated(!err));

	useEffect(() => {
		isAuthenticated();
	}, []);

	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Login} />
				<PrivateRoute
					path="/dashboard"
					redirect="/"
					component={Dashboard}
					isAuthenticated={authenticated}
					handleUnauth={() => setAuthenticated(false)}
				/>
			</Switch>
		</Router>
	);
};

export default App;
