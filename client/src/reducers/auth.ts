import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AuthSlice from '../models/state/AuthSlice';
import { getUserDetails, doLogout } from '../api/user';

const ACTION_BASE = 'auth';

export const checkAuth = createAsyncThunk(
	`${ACTION_BASE}/checkAuth`,
	async () => {
		const data = await getUserDetails();
		return data;
	},
);

export const logout = createAsyncThunk(
	`${ACTION_BASE}/logout`,
	async () => {
		const data = await doLogout();
		return data;
	},
);

export const initialState: AuthSlice = {
	isAuthenticated: null,
};

const authSlice = createSlice({
	name: ACTION_BASE,
	initialState,
	reducers: {
		changeAuth: (state, action: PayloadAction<boolean>) => {
			state.isAuthenticated = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			checkAuth.fulfilled,
			(state) => {
				state.isAuthenticated = true;
			},
		).addCase(
			checkAuth.rejected,
			(state) => {
				state.isAuthenticated = false;
			},
		);

		builder.addCase(
			logout.fulfilled,
			(state) => {
				state.isAuthenticated = false;
			},
		).addCase(
			logout.rejected,
			(state) => {
				state.isAuthenticated = false;
			},
		);
	},
});

export const { changeAuth } = authSlice.actions;
export const { name } = authSlice;
export default authSlice.reducer;
