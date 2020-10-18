import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';

import Dashboard from './Dashboard';

const mockStore = configureStore();
const store = mockStore({
	course: {
		heatmap: {
			timestamp: '',
		},
		lists: {
		  timestamp: '',
		}
	},
	timetable: { 
		timestamp: '',
		data: [],
	},
	curriculum: {
		selectedPrefix: 'Curriculum',
		currentData: {},
	},
	auth: { isAuthenticated: false, },
});

describe('Dashboard', () => {
	it('should render without crashing', () => {
		shallow(
			<Provider store={store}>
				<Dashboard />
			</Provider>
		);
	});	
});
