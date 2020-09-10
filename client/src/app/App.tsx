import React, { useEffect } from 'react';
import {
	BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ReactGA from 'react-ga';

import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

import { RootState } from './rootReducer';
import { checkAuth } from '../reducers/auth';

ReactGA.initialize('UA-156974674-1');
ReactGA.pageview(window.location.pathname + window.location.search);

const App = () => {
	const dispatch = useDispatch();
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated,
	);

	useEffect(() => {
		dispatch(checkAuth());
	// Don't add more dependencies
	// Only needs to run once
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Router>
			<Switch>
				<Route path="/login">
					{!isAuthenticated
						? <Login />
						: <Redirect to="/" />}
				</Route>

				<Route path="/">
					<Dashboard />
					{/* {isAuthenticated
						? <Dashboard />
						: <Redirect to="/login" />} */}
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
