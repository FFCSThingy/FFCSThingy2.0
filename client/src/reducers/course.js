import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	selected: '',
	heatmap: JSON.parse(localStorage.getItem('heatmap')) || [],
};

const courseSlice = createSlice({
	name: 'course',
	initialState,
	reducers: {
		selectCourse: {
			prepare(course) {
				return { payload: { course } };
			},
			reducer(state, action) {
				const { course } = action.payload;
				state.selected = course;
			},
		},
		setHeatmap: {
			prepare(heatmap) {
				return { payload: { heatmap } };
			},
			reducer(state, action) {
				const { heatmap } = action.payload;
				state.heatmap = heatmap;
			},
		},
	},
});

export const { selectCourse, setHeatmap } = courseSlice.actions;

export default courseSlice.reducer;
