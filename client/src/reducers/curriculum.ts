import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import Curriculum from '../models/data/Curriculum';

const initialState = {
	selectedPrefix: '19BCE',
	list: [] as string[],
	currentData: {},
};

const curriculumSlice = createSlice({
	name: 'curriculum',
	initialState,
	reducers: {
		setPrefixList: {
			prepare(list: string[]) {
				return { payload: { list } };
			},
			reducer(state, action: PayloadAction<{ list: string[] }, string>) {
				const { list } = action.payload;
				state.list = list;
			},
		},
		setSelectedCurriculum: {
			prepare(selectedPrefix: string) {
				return { payload: { selectedPrefix } };
			},
			reducer(state, action: PayloadAction<{ selectedPrefix: string }, string>) {
				const { selectedPrefix } = action.payload;
				state.selectedPrefix = selectedPrefix;
			},
		},
		setCurrentCurriculumData: {
			prepare(currentCurriculum: Curriculum) {
				return { payload: { currentCurriculum } };
			},
			reducer(state, action: PayloadAction<{ currentCurriculum: Curriculum }, string>) {
				const { currentCurriculum } = action.payload;
				state.currentData = currentCurriculum;
			},
		},
	},
});

export const {
	setPrefixList,
	setSelectedCurriculum,
	setCurrentCurriculumData,
} = curriculumSlice.actions;

export default curriculumSlice.reducer;
