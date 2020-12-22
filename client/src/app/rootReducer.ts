import { combineReducers } from 'redux';

import miscReducer,
{
	initialState as miscInitState,
	name as miscName,
} from '../reducers/misc';

import courseReducer,
{
	initialState as courseInitState,
	name as courseName,
} from '../reducers/course';

import timetableReducer,
{
	initialState as timetableInitState,
	name as timetableName,
} from '../reducers/timetable';

import curriculumReducer,
{
	initialState as curriculumInitState,
	name as curriculumName,
} from '../reducers/curriculum';

import userReducer,
{
	initialState as userInitState,
	name as userName,
} from '../reducers/user';

import authReducer,
{
	initialState as authInitState,
	name as authName,
} from '../reducers/auth';

const rootReducer = combineReducers({
	misc: miscReducer,
	course: courseReducer,
	timetable: timetableReducer,
	curriculum: curriculumReducer,
	user: userReducer,
	auth: authReducer,
});

export const initialState = {
	[miscName]: miscInitState,
	[courseName]: courseInitState,
	[timetableName]: timetableInitState,
	[curriculumName]: curriculumInitState,
	[userName]: userInitState,
	[authName]: authInitState,
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
