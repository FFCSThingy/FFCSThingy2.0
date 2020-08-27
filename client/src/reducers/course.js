import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	selected: '',
	heatmap: {
		data: JSON.parse(localStorage.getItem('heatmap')) || [],
		timestamp: localStorage.getItem('heatmapTimestamp') || null,
	},
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
			prepare(heatmap, timestamp) {
				return { payload: { heatmap, timestamp } };
			},
			reducer(state, action) {
				const { heatmap, timestamp } = action.payload;
				state.heatmap.data = heatmap;
				state.heatmap.timestamp = timestamp;
			},
		},
	},
});

export const { selectCourse, setHeatmap } = courseSlice.actions;

export default courseSlice.reducer;
