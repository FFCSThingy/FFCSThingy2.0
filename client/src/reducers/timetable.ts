import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import CLASHMAP from '../constants/ClashMap';

import { getTimetable, postTimetable } from '../api/user';

import TimetableCourse from '../models/data/TimetableCourse';
import HeatmapCourse from '../models/data/HeatmapCourse';
import Clashmap from '../models/constants/Clashmap';
import TimetableSlice from '../models/state/TimetableSlice';

const ACTION_BASE = 'timetable';

export const fetchTimetable = createAsyncThunk(
	`${ACTION_BASE}/fetchTimetable`,
	async (timestamp: string) => {
		const data = await getTimetable(timestamp);
		return data;
	},
);

export const syncTimetable = createAsyncThunk(
	`${ACTION_BASE}/syncTimetable`,
	async (data: { timetable: TimetableCourse[], timestamp: string }) => {
		const { timetable, timestamp } = data;
		const res = await postTimetable(timetable, timestamp);
		return res;
	},
);

const convertHeatmapToTimetableCourse = (
	timetableName: string,
	course: HeatmapCourse,
): TimetableCourse => ({
	_id: course._id,
	code: course.code,
	course_type: course.course_type,
	credits: course.credits,
	faculty: course.faculty,
	slot: course.slot,
	venue: course.venue,
	title: course.title,
	simpleCourseType: course.simpleCourseType,
	timetableName,
});

const checkExistsInArray = (
	array: Array<TimetableCourse>,
	val: TimetableCourse,
) => array.reduce((a, v) => (a || (
	v._id === val._id
	&& v.timetableName === val.timetableName
)), false);

const findFilledSlots = (data: Array<TimetableCourse>, activeTimetable: string): Array<string> => Array.from(
	new Set(
		data
			.filter((v) => v.timetableName === activeTimetable)
			.reduce<Array<string>>((a, v) => [...a, ...v.slot.replace(' ', '').split('+')], [])
			.filter((v) => v !== 'NIL'),
	),
);

const countCredits = (
	data: Array<TimetableCourse>,
	active: string,
) => data.reduce(
	(a, v) => a + ((v.timetableName === active) ? v.credits : 0),
	0,
);

const updateClashmap = (clashmap: Clashmap, filledSlots: Array<string>) => {
	const newClashmap = { ...clashmap };
	Object.keys(newClashmap)
		.map((slot) => {
			if (filledSlots.includes(slot)) {
				newClashmap[slot].isFilled = true;
			} else {
				newClashmap[slot].isFilled = false;
			}

			const currentClashes = newClashmap[slot].clashesWith
				.reduce((acc: string[], clashesWithSlot: string) => {
					if (filledSlots.includes(clashesWithSlot)) {
						acc.push(clashesWithSlot);
					}
					return acc;
				}, []);

			newClashmap[slot].currentlyClashesWith = currentClashes;
			return slot;
		});
	return newClashmap;
};

const initialState: TimetableSlice = {
	active: 'Default',
	names: ['Default'],
	filledSlots: [] as string[],
	data: JSON.parse(localStorage.getItem('timetable') || '[]'),
	timestamp: localStorage.getItem('timetableTimestamp') ?? '',
	clashmap: CLASHMAP,
	creditCount: 0,
};

const timetableSlice = createSlice({
	name: ACTION_BASE,
	initialState,
	reducers: {
		addCourse: (state, action: PayloadAction<HeatmapCourse>) => {
			const course = action.payload;
			const timestamp = new Date(Date.now()).toISOString();

			const courseWithTimetableName = convertHeatmapToTimetableCourse(
				state.active, course,
			);

			if (checkExistsInArray(state.data, courseWithTimetableName)) return;

			const newData = [...state.data, courseWithTimetableName];
			const filledSlots = findFilledSlots(newData, state.active);
			const clashmap = updateClashmap(state.clashmap, filledSlots);
			const creditCount = countCredits(newData, state.active);

			state.clashmap = clashmap;
			state.filledSlots = filledSlots;
			state.data = newData;
			state.creditCount = creditCount;
			state.timestamp = timestamp;
		},
		removeCourse: (state, action: PayloadAction<TimetableCourse>) => {
			const course = action.payload;
			const timestamp = new Date(Date.now()).toISOString();

			const newData = state.data.filter(
				(v) => !(
					v._id === course._id
						&& v.timetableName === state.active
				),
			);

			const filledSlots = findFilledSlots(newData, state.active);
			const clashmap = updateClashmap(state.clashmap, filledSlots);
			const creditCount = countCredits(newData, state.active);

			state.clashmap = clashmap;
			state.filledSlots = filledSlots;
			state.data = newData;
			state.creditCount = creditCount;
			state.timestamp = timestamp;
		},
		changeTimetable: (state, action: PayloadAction<string>) => {
			const timetableName = action.payload;

			if (!state.names.includes(timetableName)) return;

			state.active = timetableName;

			const filledSlots = findFilledSlots(state.data, timetableName);
			const clashmap = updateClashmap(state.clashmap, filledSlots);
			const creditCount = countCredits(state.data, timetableName);

			state.clashmap = clashmap;
			state.filledSlots = filledSlots;
			state.creditCount = creditCount;
		},
		addTimetable: (state, action: PayloadAction<string>) => {
			const timetableName = action.payload;

			if (state.names.includes(timetableName)) return;

			state.names.push(timetableName);
			state.active = timetableName;

			const filledSlots = findFilledSlots(state.data, timetableName);
			const clashmap = updateClashmap(state.clashmap, filledSlots);
			const creditCount = countCredits(state.data, timetableName);

			state.clashmap = clashmap;
			state.filledSlots = filledSlots;
			state.creditCount = creditCount;
		},
		removeTimetable: (state) => {
			if (state.active === 'Default') return;

			state.data = state.data.filter((v) => v.timetableName !== state.active);
			state.names = state.names.filter((v) => v !== state.active);
			[state.active] = state.names;
		},
		renameTimetable: (state, action: PayloadAction<string>) => {
			const newName = action.payload;

			if (state.names.includes(newName)) return;

			state.data = state.data.map((v) => {
				if (v.timetableName === state.active) {
					v.timetableName = newName;
				}
				return v;
			});
			state.names = state.names.map((v) => {
				if (v === state.active) {
					return newName;
				}
				return v;
			});
			state.active = newName;
		},
		copyTimetable: (state, action: PayloadAction<string>) => {
			const newName = action.payload;

			const copiedCourses = state.data
				.filter((v) => v.timetableName === state.active)
				.map((v) => ({ ...v, timetableName: newName }));

			state.data = [...state.data, ...copiedCourses];
			state.names = [...state.names, newName];
			state.active = newName;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			syncTimetable.fulfilled,
			(
				state,
				action: PayloadAction<{timetable: TimetableCourse[], timestamp: string}>,
			) => {
				const {
					timetable,
					timestamp = new Date(Date.now()).toISOString(),
				} = action.payload;

				const filledSlots = findFilledSlots(timetable, state.active);
				const clashmap = updateClashmap(state.clashmap, filledSlots);
				const creditCount = countCredits(timetable, state.active);

				state.clashmap = clashmap;
				state.filledSlots = filledSlots;
				state.data = timetable;
				state.creditCount = creditCount;
				state.timestamp = timestamp;
			},
		);
	},
});

export const {
	addCourse,
	removeCourse,
	changeTimetable,
	addTimetable,
	removeTimetable,
	renameTimetable,
	copyTimetable,
} = timetableSlice.actions;

export default timetableSlice.reducer;
