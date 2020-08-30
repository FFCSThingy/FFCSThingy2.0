import { combineReducers } from 'redux';

import miscReducer from './misc';
import courseReducer from './course';
import timetableReducer from './timetable';

const rootReducer = combineReducers({
	misc: miscReducer,
	course: courseReducer,
	timetable: timetableReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
