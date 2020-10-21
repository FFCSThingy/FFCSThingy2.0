import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import MiscSlice from '../models/state/MiscSlice';

const ACTION_BASE = 'misc';

export const changeTheme = createAsyncThunk(
	`${ACTION_BASE}/changeTheme`,
	async (theme: string) => {
		document.documentElement.className = '';
		document.documentElement.classList.add(`theme-${theme}`);

		return theme;
	},
);

export const initialState: MiscSlice = {
	theme: localStorage.getItem('theme') ?? 'default',
};

const miscSlice = createSlice({
	name: ACTION_BASE,
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(
			changeTheme.fulfilled,
			(state, action: PayloadAction<string>) => {
				const theme = action.payload;
				state.theme = theme;
			},
		);
	},
});

// export const {  } = miscSlice.actions;

export const { name } = miscSlice;
export default miscSlice.reducer;
