import { combineReducers } from 'redux';

import miscReducer from './misc';

export default combineReducers({
	misc: miscReducer,
});
