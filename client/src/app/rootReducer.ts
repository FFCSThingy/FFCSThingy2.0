import { combineReducers } from 'redux';

import miscReducer from '../reducers/misc';
import courseReducer from '../reducers/course';
import timetableReducer from '../reducers/timetable';
import curriculumReducer from '../reducers/curriculum';
import userReducer from '../reducers/user';
import authReducer from '../reducers/auth';

const rootReducer = combineReducers({
	misc: miscReducer,
	course: courseReducer,
	timetable: timetableReducer,
	curriculum: curriculumReducer,
	user: userReducer,
	auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
