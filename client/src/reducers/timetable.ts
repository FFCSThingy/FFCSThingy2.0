import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import CLASHMAP from '../constants/ClashMap';

import { postSyncTimetable } from '../api/user';

import TimetableCourse from '../models/data/TimetableCourse';
import HeatmapCourse from '../models/data/HeatmapCourse';
import Clashmap from '../models/constants/Clashmap';
import TimetableSlice from '../models/state/TimetableSlice';

const ACTION_BASE = 'timetable';
const DEFAULT_TT_NAME = 'Default';

export const syncTimetable = createAsyncThunk(
	`${ACTION_BASE}/syncTimetable`,
	async (data: { timetable: TimetableCourse[], timestamp: string }) => {
		const { timetable, timestamp } = data;
		const res = await postSyncTimetable(timetable, timestamp);
		return res;
	},
);

export const convertHeatmapToTimetableCourse = (
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

export const checkExistsInArray = (
	array: TimetableCourse[],
	val: TimetableCourse,
) => array.reduce((a, v) => (a || (
	v._id === val._id
	&& v.timetableName === val.timetableName
)), false);

export const findFilledSlots = (
	data: TimetableCourse[],
	activeTimetable: string,
): string[] => Array.from(
	new Set(
		data
			.filter((v) => v.timetableName === activeTimetable)
			.reduce(
				(a, v) => [...a, ...v.slot.replace(' ', '').split('+')],
				Array<string>(),
			)
			.filter((v) => v !== 'NIL'),
	),
);

export const countCredits = (
	data: TimetableCourse[],
	active: string,
) => data.reduce(
	(a, v) => a + ((v.timetableName === active) ? v.credits : 0),
	0,
);

const updateClashmap = (
	clashmap: Clashmap,
	filledSlots: string[],
) => {
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

export const initialState: TimetableSlice = {
	active: DEFAULT_TT_NAME,
	names: [DEFAULT_TT_NAME],
	filledSlots: [],
	data: [],
	timestamp: '',
	clashmap: CLASHMAP,
	creditCount: 0,
	syncing: false,
};

const timetableSlice = createSlice({
	name: ACTION_BASE,
	initialState: { ...initialState },
	reducers: {
		clearLocalData: (state) => {
			state.active = DEFAULT_TT_NAME;
			state.names = [DEFAULT_TT_NAME];
			state.filledSlots = [];
			state.data = [];
			state.timestamp = '';
			state.clashmap = updateClashmap(state.clashmap, []);
			state.creditCount = 0;
		},
		addCourse: (
			state,
			action: PayloadAction<{
				course: HeatmapCourse,
				timeEpoch: number
			}>,
		) => {
			const { course, timeEpoch } = action.payload;
			const timestamp = new Date(timeEpoch).toISOString();

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
		removeCourse: (
			state,
			action: PayloadAction<{
				course: TimetableCourse,
				timeEpoch: number
			}>,
		) => {
			const { course, timeEpoch } = action.payload;
			const timestamp = new Date(timeEpoch).toISOString();

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
			if (state.active === DEFAULT_TT_NAME) return;

			const newData = state.data.filter((v) => v.timetableName !== state.active);
			const newNames = state.names.filter((v) => v !== state.active);
			const [newActive] = state.names;

			const filledSlots = findFilledSlots(newData, newActive);
			const clashmap = updateClashmap(state.clashmap, filledSlots);
			const creditCount = countCredits(newData, newActive);

			state.clashmap = clashmap;
			state.filledSlots = filledSlots;
			state.creditCount = creditCount;

			state.data = newData;
			state.names = newNames;
			state.active = newActive;
		},
		renameTimetable: (state, action: PayloadAction<string>) => {
			const newName = action.payload;

			if (state.active === DEFAULT_TT_NAME) return;
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
			let newTimetableName = newName;

			// Shouldn't copy if name alreadt exists
			if (state.names.includes(newName)) return;
			// If newName not given, assign the current name
			if (!newName || newName === '') {
				newTimetableName = state.active;
			}

			// Keep adding '-Copy' to the name until one is found
			// that does not exist already
			while (
				!newTimetableName
				|| newTimetableName === ''
				|| state.names.includes(newTimetableName)
			) {
				newTimetableName = `${newTimetableName}-Copy`;
			}

			const copiedCourses = state.data
				.filter((v) => v.timetableName === state.active)
				.map((v) => ({ ...v, timetableName: newTimetableName }));

			state.data = [...state.data, ...copiedCourses];
			state.names = [...state.names, newTimetableName];
			state.active = newTimetableName;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			syncTimetable.pending,
			(state) => {
				state.syncing = true;
			},
		).addCase(
			syncTimetable.rejected,
			(state) => {
				state.syncing = false;
			},
		).addCase(
			syncTimetable.fulfilled,
			(
				state,
				action: PayloadAction<{
					timetable: TimetableCourse[],
					timestamp: string
				}>,
			) => {
				const {
					timetable,
					// Timestamp should ideally always be present in server response
					timestamp,
				} = action.payload;

				const recvdNames = timetable.reduce(
					(a, v) => a.add(v.timetableName),
					new Set<string>(),
				);
				recvdNames.delete(DEFAULT_TT_NAME);
				const recvdNamesArray = Array.from(recvdNames);
				const combinedNameArray = [...state.names, ...recvdNamesArray];
				const newNameArray = Array.from(
					new Set<string>(combinedNameArray),
				);

				// Can't think of a case where this would be useful
				// Should add test for this branch
				// if (!newNameArray.includes(state.active)) {
				// 	state.active = DEFAULT_TT_NAME;
				// }

				const filledSlots = findFilledSlots(timetable, state.active);
				const clashmap = updateClashmap(state.clashmap, filledSlots);
				const creditCount = countCredits(timetable, state.active);

				state.names = newNameArray;
				state.clashmap = clashmap;
				state.filledSlots = filledSlots;
				state.data = timetable;
				state.creditCount = creditCount;
				state.timestamp = timestamp;
				state.syncing = false;
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
	clearLocalData,
} = timetableSlice.actions;
export const { name } = timetableSlice;
export default timetableSlice.reducer;
