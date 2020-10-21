import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import configureStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';

import Dashboard from './Dashboard';

import { initialState } from '../app/rootReducer';
import { syncTimetable } from '../reducers/timetable';
import { fetchHeatmap, fetchAllCourseLists } from '../reducers/course';
import {
	fetchCurriculumPrefixes,
	fetchCurriculumFromPrefix,
	setCurrentCurriculumData,
} from '../reducers/curriculum';
import {
	fetchCompletedCourses,
	fetchUserDetails,
} from '../reducers/user';

const mockStore = configureStore([thunk]);

describe('component: Dashboard', () => {
	it('should render without crashing', () => {
		expect.hasAssertions();
		const store = mockStore(initialState);
		const dashboard = shallow(
			<Provider store={store}>
				<Dashboard />
			</Provider>,
		);

		expect(dashboard.contains(<Dashboard />)).toBeTruthy();

		dashboard.unmount();
	});

	it('should dispatch certain actions on non-auth state', () => {
		expect.hasAssertions();
		const store = mockStore(initialState);
		const dashboard = mount(
			<Provider store={store}>
				<Dashboard />
			</Provider>,
		);

		const expectedDispatches = [
			fetchCurriculumPrefixes.pending.type,
			fetchHeatmap.pending.type,
			fetchAllCourseLists.pending.type,
			fetchCurriculumFromPrefix.pending.type,
		];

		store.getActions()
			.forEach((action) => expect(
				expectedDispatches,
			).toContain(action.type));

		expectedDispatches
			.forEach((disp) => expect(
				store.getActions()
					.map((a) => a.type),
			).toContain(disp));

		expect(store.getActions()).toHaveLength(expectedDispatches.length);

		dashboard.unmount();
	});

	it('should dispatch certain actions on auth state', () => {
		expect.hasAssertions();
		const store = mockStore({
			...initialState,
			auth: {
				...initialState.auth,
				isAuthenticated: true,
			},
		});
		const dashboard = mount(
			<Provider store={store}>
				<Dashboard />
			</Provider>,
		);

		const expectedDispatches = [
			fetchCurriculumPrefixes.pending.type,
			fetchHeatmap.pending.type,
			fetchAllCourseLists.pending.type,
			fetchCurriculumFromPrefix.pending.type,
			fetchUserDetails.pending.type,
			fetchCompletedCourses.pending.type,
			syncTimetable.pending.type,
		];

		store.getActions()
			.forEach((action) => expect(
				expectedDispatches,
			).toContain(action.type));

		expectedDispatches
			.forEach((disp) => expect(
				store.getActions()
					.map((a) => a.type),
			).toContain(disp));

		expect(store.getActions()).toHaveLength(expectedDispatches.length);

		dashboard.unmount();
	});

	it('should fetch curriculum data if localStorage has empty array', () => {
		expect.hasAssertions();
		const mockedgetItem = jest.spyOn(Object.getPrototypeOf(localStorage), 'getItem')
			.mockReturnValue('[]');

		const selectedPrefix = '17BCI';
		const store = mockStore({
			...initialState,
			curriculum: {
				...initialState.curriculum,
				selectedPrefix,
			},
		});
		const dashboard = mount(
			<Provider store={store}>
				<Dashboard />
			</Provider>,
		);

		const actions = store.getActions();
		const fetchCurriculumAction = actions.find(
			(v) => v.type === fetchCurriculumFromPrefix.pending.type,
		);

		expect(mockedgetItem).toHaveBeenCalledWith(selectedPrefix);
		expect(fetchCurriculumAction).not.toBeUndefined();
		expect(fetchCurriculumAction.meta.arg).toStrictEqual(selectedPrefix);

		dashboard.unmount();
	});

	it('should set curriculum data from localStorage if present', () => {
		expect.hasAssertions();
		const mockLocalStorageData = { _id: 'sampleId' };
		jest.spyOn(Object.getPrototypeOf(localStorage), 'getItem')
			.mockReturnValue(JSON.stringify(mockLocalStorageData));

		const store = mockStore(initialState);
		const dashboard = mount(
			<Provider store={store}>
				<Dashboard />
			</Provider>,
		);

		const actions = store.getActions();
		const setCurriculumAction = actions.find(
			(v) => v.type === setCurrentCurriculumData.type,
		);

		expect(setCurriculumAction).not.toBeUndefined();
		expect(setCurriculumAction.payload).toStrictEqual({
			currentCurriculum: mockLocalStorageData,
		});

		dashboard.unmount();
	});

	it('should write curriculum to localStorage if not "Curriculum"', () => {
		expect.hasAssertions();
		const mockedSetItem = jest.spyOn(
			Object.getPrototypeOf(localStorage),
			'setItem',
		);

		const selectedPrefix = '17BCI';
		const currentData = {
			reg_prefix: selectedPrefix,
		};
		const store = mockStore({
			...initialState,
			curriculum: {
				...initialState.curriculum,
				selectedPrefix,
				currentData,
			},
		});
		const dashboard = mount(
			<Provider store={store}>
				<Dashboard />
			</Provider>,
		);

		expect(mockedSetItem).toHaveBeenCalledWith(
			selectedPrefix,
			JSON.stringify(currentData),
		);

		dashboard.unmount();
	});

	it('should call fetchHeatmap regularly', () => {
		expect.hasAssertions();
		jest.useFakeTimers();

		const store = mockStore(initialState);
		const dashboard = mount(
			<Provider store={store}>
				<Dashboard />
			</Provider>,
		);

		// Forward by 2 mins
		jest.advanceTimersByTime(1000 * 60 * 2);

		const fetchHeatmapActions = store.getActions()
			.filter((v) => v.type === fetchHeatmap.pending.type);

		// Check fetchHeatmap is called twice
		expect(fetchHeatmapActions).toHaveLength(2);

		dashboard.unmount();
	});

	it('should call syncTimetable regularly if signed in', () => {
		expect.hasAssertions();
		jest.useFakeTimers();

		const store = mockStore({
			...initialState,
			auth: {
				...initialState.auth,
				isAuthenticated: true,
			},
		});
		const dashboard = mount(
			<Provider store={store}>
				<Dashboard />
			</Provider>,
		);

		// Forward by 2 mins
		jest.advanceTimersByTime(1000 * 60 * 1);

		// Check fetchHeatmap is called twice
		const fetchHeatmapActions = store.getActions()
			.filter((v) => v.type === syncTimetable.pending.type);

		expect(fetchHeatmapActions).toHaveLength(2);

		dashboard.unmount();
	});
});
