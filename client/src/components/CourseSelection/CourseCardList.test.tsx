import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CourseCardList from './CourseCardList';

import { initialState } from '../../app/rootReducer';
import { CourseList } from '../../models/data/CourseLists';

const mockStore = configureStore([thunk]);

const courseList: CourseList = {
	ZZZ1001: {
		title: 'Sample1',
		credits: 4,
		types: ['ETH', 'ELA', 'EPJ'],
		simpleCourseTypes: ['Lab', 'Theory', 'Project'],
		shortCourseTypes: ['L', 'T', 'P'],
	},
	ZZZ1002: {
		title: 'Sample2',
		credits: 4,
		types: ['ETH', 'ELA', 'EPJ'],
		simpleCourseTypes: ['Lab', 'Theory', 'Project'],
		shortCourseTypes: ['L', 'T', 'P'],
	},
	ZZZ1003: {
		title: 'Sample3',
		credits: 4,
		types: ['ETH', 'ELA', 'EPJ'],
		simpleCourseTypes: ['Lab', 'Theory', 'Project'],
		shortCourseTypes: ['L', 'T', 'P'],
	},
};

describe('component: CourseCardList', () => {
	it('should render without explicit props', () => {
		expect.hasAssertions();

		const store = mockStore(initialState);
		const { asFragment } = render(
			<Provider store={store}>
				<CourseCardList />
			</Provider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should render with filtered course list', () => {
		expect.hasAssertions();

		const store = mockStore(initialState);
		const { asFragment } = render(
			<Provider store={store}>
				<CourseCardList
					filteredCourseList={courseList}
				/>
			</Provider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should render completed courses if data present', () => {
		expect.hasAssertions();

		const store = mockStore({
			...initialState,
			user: {
				...initialState.user,
				completedCourses: {
					ZZZ1001: 'N',
					ZZZ1003: 'A',
				},
			},
		});
		const { asFragment } = render(
			<Provider store={store}>
				<CourseCardList
					filteredCourseList={courseList}
				/>
			</Provider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
