import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	theme: 'default',
};

const miscSlice = createSlice({
	name: 'misc',
	initialState,
	reducers: {
		changeTheme: {
			prepare(theme) {
				return { payload: { theme } };
			},
			reducer(state, action) {
				console.log('Theme reducer called');
				const { theme } = action.payload;
				state.theme = theme;
			},
		},
	},
});

export const { changeTheme } = miscSlice.actions;

export default miscSlice.reducer;
