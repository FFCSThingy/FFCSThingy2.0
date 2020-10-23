import memoizeOne from 'memoize-one';
import { createSelector } from '@reduxjs/toolkit';
import HeatmapCourse from '../models/data/HeatmapCourse';
import {
	selectClashmap,
	selectTimetable,
	selectActiveTimetableName,
} from './timetable';
import {
	selectHeatmap,
	selectSelectedCourse,
} from './course';

export const selectSlotsForCourse = createSelector(
	[selectHeatmap, selectSelectedCourse],
	(heatmap, selectedCourse) => heatmap.filter(
		(course) => course.code === selectedCourse,
	),
);

export const selectClashingSlots = createSelector(
	[selectClashmap],
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
	[selectTimetable, selectActiveTimetableName],
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
	[selectTimetable, selectActiveTimetableName],
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
