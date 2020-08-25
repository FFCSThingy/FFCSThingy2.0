import { combineReducers } from 'redux';

import miscReducer from './misc';
import courseReducer from './course';

export default combineReducers({
	misc: miscReducer,
	course: courseReducer,
});
