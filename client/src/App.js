import React, { useEffect, useState } from 'react';
import {
	Route, BrowserRouter as Router, Switch,
} from 'react-router-dom';

import ReactGA from 'react-ga';

import API from './API';

import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

ReactGA.initialize('UA-156974674-1');
ReactGA.pageview(window.location.pathname + window.location.search);

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
				<Route exact path="/login" component={Login} />
				<PrivateRoute
					path="/"
					redirect="/login"
					component={Dashboard}
					isAuthenticated={authenticated}
					handleUnauth={() => setAuthenticated(false)}
				/>
			</Switch>
		</Router>
	);
};

export default App;
