import React, { useEffect } from 'react';
import {
	BrowserRouter as Router, Switch,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ReactGA from 'react-ga';

import PrivateRoute from '../components/PrivateRoute';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import Theme from '../components/Theme';

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
	}, []);

	return (
		<>
			<Theme />
			<Router>
				<Switch>
					{/* <Route exact path="/login" component={Login} /> */}
					<PrivateRoute
						path="/login"
						redirect="/"
						component={Login}
						isAuthenticated={!isAuthenticated}
					/>

					<PrivateRoute
						path="/"
						redirect="/login"
						component={Dashboard}
						isAuthenticated={isAuthenticated}
					/>
				</Switch>
			</Router>
		</>
	);
};

export default App;
