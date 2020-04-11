import React, { useEffect, useState } from 'react';
import {
	BrowserRouter as Router, Switch,
} from 'react-router-dom';

import ReactGA from 'react-ga';

import API from './API';

import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard';

ReactGA.initialize('UA-156974674-1');
ReactGA.pageview(window.location.pathname + window.location.search);

const App = () => {
	const [authenticated, setAuthenticated] = useState(false);

	const isAuthenticated = () => API.get('/account')
		.then((res) => {
			if (res.data.google_id) {
				setAuthenticated(true);
			} else {
				setAuthenticated(false);
			}
		})
		.catch((err) => setAuthenticated(!err));

	useEffect(() => {
		isAuthenticated();
	}, []);

	return (
		<Router>
			<Switch>
				{/* <Route exact path="/login" component={Login} /> */}
				<PrivateRoute
					path="/login"
					redirect="/"
					component={Login}
					isAuthenticated={!authenticated}
				/>

				<PrivateRoute
					path="/"
					redirect="/login"
					component={Dashboard}
					isAuthenticated={authenticated}
					handleUnauth={() => {
						API.get('/logout');
						setAuthenticated(false);
					}}
				/>
			</Switch>
		</Router>
	);
};

export default App;
