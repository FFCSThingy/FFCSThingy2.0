import { combineReducers } from 'redux';

import miscReducer from './misc';
import courseReducer from './course';
import timetableReducer from './timetable';

export default combineReducers({
	misc: miscReducer,
	course: courseReducer,
	timetable: timetableReducer,
});
