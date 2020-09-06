import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserDetails, { CompletedCourses } from '../models/data/UserDetails';
import UserSliceModel from '../models/state/UserSlice';

const ACTION_BASE = 'user';

const initialState: UserSliceModel = {
	details: {
		google_id: '',
		display_name: '',
		picture: '',
		email: '',
		vtopSignedIn: false,
	},
	completedCourses: {},
};

const userSlice = createSlice({
	name: ACTION_BASE,
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
} = userSlice.actions;

export default userSlice.reducer;
