import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import HeatmapCourse from '../models/data/HeatmapCourse';
import {
	CourseList,
	CourseSlotList,
	CourseTypeList,
	CourseFacultyList,
} from '../models/data/CourseLists';
import RequisitesList from '../models/data/RequisitesList';
import CourseSlice from '../models/state/CourseSlice';

const ACTION_BASE = 'course';

const initialState: CourseSlice = {
	selected: '',
	heatmap: {
		data: JSON.parse(localStorage.getItem('heatmap') || '[]'),
		timestamp: localStorage.getItem('heatmapTimestamp'),
	},
	lists: {
		course: {},
		slot: {},
		faculty: {},
		type: {},
		req: {},
	},
};

const courseSlice = createSlice({
	name: ACTION_BASE,
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
		setCourseList: {
			prepare(list: CourseList) {
				return { payload: { list } };
			},
			reducer(state, action: PayloadAction<{ list: CourseList }, string>) {
				const { list } = action.payload;
				state.lists.course = list;
			},
		},
		setCourseFacultyList: {
			prepare(list: CourseFacultyList) {
				return { payload: { list } };
			},
			reducer(state, action: PayloadAction<{ list: CourseFacultyList }, string>) {
				const { list } = action.payload;
				state.lists.faculty = list;
			},
		},
		setCourseSlotList: {
			prepare(list: CourseSlotList) {
				return { payload: { list } };
			},
			reducer(state, action: PayloadAction<{ list: CourseSlotList }, string>) {
				const { list } = action.payload;
				state.lists.slot = list;
			},
		},
		setCourseTypeList: {
			prepare(list: CourseTypeList) {
				return { payload: { list } };
			},
			reducer(state, action: PayloadAction<{ list: CourseTypeList }, string>) {
				const { list } = action.payload;
				state.lists.type = list;
			},
		},
		setReqList: {
			prepare(list: RequisitesList) {
				return { payload: { list } };
			},
			reducer(state, action: PayloadAction<{ list: RequisitesList }, string>) {
				const { list } = action.payload;
				state.lists.req = list;
			},
		},
	},
});

export const {
	selectCourse,
	setHeatmap,
	setCourseList,
	setCourseFacultyList,
	setCourseSlotList,
	setCourseTypeList,
	setReqList,
} = courseSlice.actions;

export default courseSlice.reducer;
