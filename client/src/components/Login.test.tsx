import React from 'react';
import { Context as ResponsiveContext } from 'react-responsive';
import { render, screen } from '@testing-library/react';

import Login from './Login';

describe('component: Login', () => {
	it('should match mobile snapshot (<768px width)', () => {
		expect.hasAssertions();
		const { asFragment } = render(
			<ResponsiveContext.Provider value={{ deviceWidth: 350 }}>
				<Login />
			</ResponsiveContext.Provider>,
		);

		expect(screen.queryByAltText('features')).toBeFalsy();
		expect(asFragment()).toMatchSnapshot();
	});

	it('should match desktop snapshot (>=768px width)', () => {
		expect.hasAssertions();

		const { asFragment } = render(
			<ResponsiveContext.Provider value={{ deviceWidth: 1000 }}>
				<Login />
			</ResponsiveContext.Provider>,
		);

		expect(screen.queryByAltText('features')).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
