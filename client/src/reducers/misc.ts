import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import MiscSlice from '../models/state/MiscSlice';

const ACTION_BASE = 'misc';

const initialState: MiscSlice = {
	theme: localStorage.getItem('theme') ?? 'default',
};

const miscSlice = createSlice({
	name: ACTION_BASE,
	initialState,
	reducers: {
		changeTheme: {
			prepare(theme) {
				return { payload: { theme } };
			},
			reducer(state, action: PayloadAction<{ theme: string }, string>) {
				const { theme } = action.payload;
				state.theme = theme;
			},
		},
	},
});

export const { changeTheme } = miscSlice.actions;

export default miscSlice.reducer;
