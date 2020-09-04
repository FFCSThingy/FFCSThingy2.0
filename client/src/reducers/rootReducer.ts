import { combineReducers } from 'redux';

import miscReducer from './misc';
import courseReducer from './course';
import timetableReducer from './timetable';
import curriculumReducer from './curriculum';

const rootReducer = combineReducers({
	misc: miscReducer,
	course: courseReducer,
	timetable: timetableReducer,
	curriculum: curriculumReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
