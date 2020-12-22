import {
	createSlice,
	PayloadAction,
	createAsyncThunk,
} from '@reduxjs/toolkit';

import { getCurriculumPrefixes, getCurriculumByPrefix } from '../api/curriculum';

import Curriculum from '../models/data/Curriculum';
import CurriculumSlice from '../models/state/CurriculumSlice';

const ACTION_BASE = 'curriculum';

export const fetchCurriculumPrefixes = createAsyncThunk(
	`${ACTION_BASE}/fetchCurriculumPrefixes`,
	async () => {
		const data = await getCurriculumPrefixes();
		return data;
	},
);

export const fetchCurriculumFromPrefix = createAsyncThunk(
	`${ACTION_BASE}/fetchCurriculumFromPrefix`,
	async (prefix: string) => {
		const data = await getCurriculumByPrefix(prefix);
		return data;
	},
);

export const initialState: CurriculumSlice = {
	selectedPrefix: 'Curriculum',
	list: [] as string[],
	currentData: {
		_id: '',
		reg_prefix: '',
		__v: 0,
		todo_creds: {
			pc: 0,
			uc: 0,
			pe: 0,
			ue: 0,
		},
		bridge: [],
		pc: [],
		uc: [],
		pe: [],
		ue: [],
	},
};

const curriculumSlice = createSlice({
	name: ACTION_BASE,
	initialState: { ...initialState },
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
	extraReducers: (builder) => {
		builder.addCase(
			fetchCurriculumPrefixes.fulfilled,
			(state, action: PayloadAction<string[]>) => {
				const list = action.payload;
				if (
					!list.includes(state.selectedPrefix)
					&& state.selectedPrefix !== 'Curriculum'
				) {
					[state.selectedPrefix] = list;
				}

				state.list = list;
			},
		);

		builder.addCase(
			fetchCurriculumFromPrefix.fulfilled,
			(state, action: PayloadAction<Curriculum>) => {
				const data = action.payload;
				state.currentData = data;
			},
		).addCase(
			fetchCurriculumFromPrefix.rejected,
			(state) => {
				state.selectedPrefix = 'Curriculum';
				state.currentData = {
					_id: '',
					reg_prefix: '',
					__v: 0,
					todo_creds: {
						pc: 0,
						uc: 0,
						pe: 0,
						ue: 0,
					},
					bridge: [],
					pc: [],
					uc: [],
					pe: [],
					ue: [],
				};
			},
		);
	},
});

export const {
	setPrefixList,
	setSelectedCurriculum,
	setCurrentCurriculumData,
} = curriculumSlice.actions;

export const { name } = curriculumSlice;
export default curriculumSlice.reducer;
