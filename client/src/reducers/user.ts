import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { getUserDetails, getCompletedCourses } from '../api/user';

import UserDetails, { CompletedCourses } from '../models/data/UserDetails';
import UserSliceModel from '../models/state/UserSlice';

const ACTION_BASE = 'user';

export const fetchUserDetails = createAsyncThunk(
	`${ACTION_BASE}/fetchUserDetails`,
	async () => {
		const data = await getUserDetails();
		return data;
	},
);

export const fetchCompletedCourses = createAsyncThunk(
	`${ACTION_BASE}/fetchCompletedCourses`,
	async () => {
		const data = await getCompletedCourses();
		return data;
	},
);

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
	extraReducers: (builder) => {
		builder.addCase(
			fetchUserDetails.fulfilled,
			(state, action: PayloadAction<UserDetails>) => {
				state.details = action.payload;
			},
		);

		builder.addCase(
			fetchCompletedCourses.fulfilled,
			(state, action: PayloadAction<CompletedCourses>) => {
				state.completedCourses = action.payload;
			},
		);
	},
});

export const {
	setCompletedCourses,
	setUserDetails,
} = userSlice.actions;

export default userSlice.reducer;
