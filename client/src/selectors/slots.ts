import memoizeOne from 'memoize-one';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../app/rootReducer';
import HeatmapCourse from '../models/data/HeatmapCourse';

const selectHeatmap = (state: RootState) => state.course.heatmap.data;
const selectSelectedCourse = (state: RootState) => state.course.selected;
const selectClashMap = (state: RootState) => state.timetable.clashmap;
const selectTimetable = (state: RootState) => state.timetable.data;
const selectActiveTimetable = (state: RootState) => state.timetable.active;

export const selectSlotsForCourse = createSelector(
	[selectHeatmap, selectSelectedCourse],
	(heatmap, selectedCourse) => heatmap.filter(
		(course) => course.code === selectedCourse,
	),
);

export const selectClashingSlots = createSelector(
	[selectClashMap],
	(clashmap) => memoizeOne(
		(slot: string) => {
			if (slot === 'NIL') return [];

			const clashingSlots = slot.replace(' ', '').split('+')
				.reduce(
					(a: string[], v: string) => Array.from(
						new Set<string>([
							...a,
							...clashmap[v].currentlyClashesWith,
						]),
					),
					[],
				)
				.filter((v) => v && v.length > 0);

			return clashingSlots;
		},
	),
);

export const checkSelected = createSelector(
	[selectTimetable, selectActiveTimetable],
	(timetable, active) => memoizeOne(
		(course: HeatmapCourse) => timetable.reduce(
			(a, timetableCourse) => (a || (
				timetableCourse._id === course._id
				&& timetableCourse.timetableName === active
			)),
			false,
		),
	),
);

export const checkRelated = createSelector(
	[selectTimetable, selectActiveTimetable],
	(timetable, active) => memoizeOne(
		(course: HeatmapCourse) => timetable.reduce(
			(a, timetableCourse) => {
				if (timetableCourse.timetableName !== active) {
					return a || false;
				}

				if (course.simpleCourseType === timetableCourse.simpleCourseType) {
					return a || false;
				}

				if (
					timetableCourse.code === course.code
					&& timetableCourse.faculty === course.faculty
				) {
					return a || true;
				}

				return a || false;
			},
			false,
		),
	),
);
