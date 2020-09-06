import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserDetails, { CompletedCourses } from '../models/data/UserDetails';

const initialState = {
	details: {},
	completedCourses: {},
};

const UserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setCompletedCourses: {
			prepare(courses: CompletedCourses) {
				return { payload: { courses } };
			},
			reducer(state, action: PayloadAction<{ courses: CompletedCourses }, string>) {
				const { courses } = action.payload;
				state.completedCourses = courses;
			},
		},
		setUserDetails: {
			prepare(details: UserDetails) {
				return { payload: { details } };
			},
			reducer(state, action: PayloadAction<{ details: UserDetails }, string>) {
				const { details } = action.payload;
				state.details = details;
			},
		},
	},
});

export const {
	setCompletedCourses,
	setUserDetails,
} = UserSlice.actions;

export default UserSlice.reducer;
