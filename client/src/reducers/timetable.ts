import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CLASHMAP from '../constants/clashmapTry';
// Uses a copy of the same file because apparently the original clashmap gets modified somewhere?
// IDK what is going on
// Throws a state mutated between dispatch error

import HeatmapCourse from '../models/data/HeatmapCourse';
import Clashmap from '../models/constants/Clashmap';

const checkExistsInArray = (
	array: Array<HeatmapCourse>,
	val: HeatmapCourse,
) => array.reduce((a, v) => (a || (
	v._id === val._id
	&& v.timetableName === val.timetableName
)), false);

const findFilledSlots = (data: Array<HeatmapCourse>, activeTimetable: string): Array<string> => Array.from(
	new Set(
		data
			.filter((v) => v.timetableName === activeTimetable)
			.reduce<Array<string>>((a, v) => [...a, ...v.slot.replace(' ', '').split('+')], [])
			.filter((v) => v !== 'NIL'),
	),
);

const countCredits = (data: Array<HeatmapCourse>) => data.reduce((a, v) => a + v.credits, 0);

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

const initialState = {
	active: 'Default',
	names: ['Default'],
	filledSlots: [] as Array<string>,
	data: JSON.parse(localStorage.getItem('timetable') || '[]'),
	timestamp: localStorage.getItem('timetableTimestamp') || null,
	clashmap: CLASHMAP,
	creditCount: 0,
};

const timetableSlice = createSlice({
	name: 'timetable',
	initialState,
	reducers: {
		addCourse: {
			prepare(course: HeatmapCourse, timestamp: string = new Date(Date.now()).toISOString()) {
				return { payload: { course, timestamp } };
			},
			reducer(state, action: PayloadAction<{course: HeatmapCourse, timestamp: string}, string>) {
				const { course, timestamp } = action.payload;
				const courseWithTimetableName = { ...course, timetableName: state.active };

				if (checkExistsInArray(state.data, courseWithTimetableName)) return;

				const newData = [...state.data, courseWithTimetableName];
				const filledSlots = findFilledSlots(newData, state.active);
				const clashmap = updateClashmap(state.clashmap, filledSlots);
				const creditCount = countCredits(newData);

				state.clashmap = clashmap;
				state.filledSlots = filledSlots;
				state.data = newData;
				state.creditCount = creditCount;
				state.timestamp = timestamp;
			},
		},
		removeCourse: {
			prepare(course: HeatmapCourse, timestamp: string = new Date(Date.now()).toISOString()) {
				return { payload: { course, timestamp } };
			},
			reducer(state, action: PayloadAction<{course: HeatmapCourse, timestamp: string}, string>) {
				const { course, timestamp } = action.payload;

				const newData = state.data.filter(
					(v: HeatmapCourse) => !(v._id === course._id && v.timetableName === state.active),
				);

				const filledSlots = findFilledSlots(newData, state.active);
				const clashmap = updateClashmap(state.clashmap, filledSlots);
				const creditCount = countCredits(newData);

				state.clashmap = clashmap;
				state.filledSlots = filledSlots;
				state.data = newData;
				state.creditCount = creditCount;
				state.timestamp = timestamp;
			},
		},
	},
});

export const { addCourse, removeCourse } = timetableSlice.actions;

export default timetableSlice.reducer;
