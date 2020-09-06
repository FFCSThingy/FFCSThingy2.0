import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import memoizeOne from 'memoize-one';

import SlotTable from './SlotTable';

import { selectCourse } from '../../reducers/course';
import { addCourse } from '../../reducers/timetable';

import { RootState } from '../../app/rootReducer';
import HeatmapCourse from '../../models/data/HeatmapCourse';

const selectHeatmap = (state: RootState) => state.course.heatmap.data;
const selectSelectedCourse = (state: RootState) => state.course.selected;
const selectClashMap = (state: RootState) => state.timetable.clashmap;
const selectTimetable = (state: RootState) => state.timetable.data;
const selectActiveTimetable = (state: RootState) => state.timetable.active;

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

const mapStateToProps = (state: RootState) => ({
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
