import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import memoizeOne from 'memoize-one';

import SlotTable from './SlotTable';

import { selectCourse } from '../../reducers/course';
import { addCourse } from '../../reducers/timetable';

import State from '../../models/state/State';
import HeatmapCourse from '../../models/data/HeatmapCourse';

const selectHeatmap = (state: State) => state.course.heatmap.data;
const selectSelectedCourse = (state: State) => state.course.selected;
const selectClashMap = (state: State) => state.timetable.clashmap;
const selectTimetable = (state: State) => state.timetable.data;
const selectActiveTimetable = (state: State) => state.timetable.active;

const selectFilteredSlots = createSelector(
	[selectHeatmap, selectSelectedCourse],
	(heatmap, selectedCourse) => heatmap.filter((course) => course.code === selectedCourse),
);

const selectClashingSlots = createSelector(
	[selectClashMap],
	(clashmap) => memoizeOne(
		(slot: string) => {
			if (slot === 'NIL') return [];

			const clashingSlots = slot.replace(' ', '').split('+')
				.reduce<string[]>((a, v) => Array.from(new Set([...a, ...clashmap[v].currentlyClashesWith])), [])
				.filter((v) => v && v.length > 0);

			return clashingSlots;
		},
	),
);

const checkSelected = createSelector(
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

const checkRelated = createSelector(
	[selectTimetable, selectActiveTimetable],
	(timetable, active) => memoizeOne(
		(course: HeatmapCourse) => timetable.reduce(
			(a, timetableCourse) => {
				if (timetableCourse.timetableName !== active) {
					return a || false;
				}

				if (course.simpleCourseType === 'Project') {
					if (timetableCourse.simpleCourseType === 'Project') {
						return a || false;
					}
					if (
						timetableCourse.code === course.code
						&& timetableCourse.faculty === course.faculty
					) { return a || true; }
				} else if (course.simpleCourseType === 'Theory') {
					if (timetableCourse.simpleCourseType === 'Theory') {
						return a || false;
					}
					if (
						timetableCourse.code === course.code
						&& timetableCourse.faculty === course.faculty
					) { return a || true; }
				} else if (course.simpleCourseType === 'Lab') {
					if (timetableCourse.simpleCourseType === 'Lab') {
						return a || false;
					}
					if (
						timetableCourse.code === course.code
						&& timetableCourse.faculty === course.faculty
					) { return a || true; }
				}

				return a || false;
			},
			false,
		),
	),
);

const mapStateToProps = (state: State) => ({
	selectedCourse: state.course.selected,
	slots: selectFilteredSlots(state),
	clashesWith: selectClashingSlots(state),
	checkSelected: checkSelected(state),
	checkRelated: checkRelated(state),
});

const mapDispatch = { selectCourse, addCourse };

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SlotTableContainer: FC<PropsFromRedux> = (props) => (
	<SlotTable
		selectedCourse={props.selectedCourse}
		slots={props.slots}

		addSlotToTimetable={props.addCourse}
		slotClashesWith={props.clashesWith}
		isSelected={props.checkSelected}
		checkRelated={props.checkRelated}
	/>
);

export default connector(SlotTableContainer);
