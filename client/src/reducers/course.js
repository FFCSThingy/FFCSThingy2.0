import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	selected: '',
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
				console.log('course reducer called');
				const { course } = action.payload;
				console.log(course);
				state.selected = course;
			},
		},
	},
});

export const { selectCourse } = courseSlice.actions;

export default courseSlice.reducer;
