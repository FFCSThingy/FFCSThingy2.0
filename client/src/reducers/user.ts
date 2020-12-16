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

export const initialState: UserSliceModel = {
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
	reducers: {},
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

export const { name } = userSlice;
export default userSlice.reducer;
