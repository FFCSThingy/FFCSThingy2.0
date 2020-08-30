import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	theme: localStorage.getItem('theme') ?? 'default',
};

const miscSlice = createSlice({
	name: 'misc',
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
