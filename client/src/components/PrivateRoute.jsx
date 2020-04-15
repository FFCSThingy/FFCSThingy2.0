import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
	component: Component,
	isAuthenticated,
	redirect: pathname = '/',
	...rest	// Includes "path"
}) => (
	<Route
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...rest}
		render={(props) => (isAuthenticated === true ? (
			// eslint-disable-next-line react/jsx-props-no-spreading
			<Component {...rest} {...props} />
		) : (
			// <Redirect to="/" />
			<Redirect
				to={
					{
						pathname: pathname || '/',
						state: { from: props.location },
					}
				}
			/>
		))}
	/>
);

export default PrivateRoute;
