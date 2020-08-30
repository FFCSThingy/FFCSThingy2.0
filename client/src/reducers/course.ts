import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import HeatmapCourse from '../models/data/HeatmapCourse';

const initialState = {
	selected: '',
	heatmap: {
		data: JSON.parse(localStorage.getItem('heatmap') || '[]'),
		timestamp: localStorage.getItem('heatmapTimestamp'),
	},
};

const courseSlice = createSlice({
	name: 'course',
	initialState,
	reducers: {
		selectCourse: {
			prepare(course: string) {
				return { payload: { course } };
			},
			reducer(state, action: PayloadAction<{ course: string }, string>) {
				const { course } = action.payload;
				state.selected = course;
			},
		},
		setHeatmap: {
			prepare(heatmap: HeatmapCourse[], timestamp: string) {
				return { payload: { heatmap, timestamp } };
			},
			reducer(state, action: PayloadAction<{ heatmap: HeatmapCourse[], timestamp: string }, string>) {
				const { heatmap, timestamp } = action.payload;
				state.heatmap.data = heatmap;
				state.heatmap.timestamp = timestamp;
			},
		},
	},
});

export const { selectCourse, setHeatmap } = courseSlice.actions;

export default courseSlice.reducer;
