import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

const PrivateRoute = ({
	component: Component,
	isAuthenticated,
	redirect: pathname,
	...rest
}) => (
	<Route
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...rest}
		render={(props) => (isAuthenticated === true ? (
			// eslint-disable-next-line react/jsx-props-no-spreading
			<Component {...rest} {...props} />
		) : (
			<Redirect
				to={{
					pathname,
					state: { from: props.location },
				}}
			/>
		))}
	/>
);

PrivateRoute.defaultProps = { redirect: '/' };

PrivateRoute.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	component: PropTypes.func.isRequired,
	redirect: PropTypes.string,
};

export default PrivateRoute;
