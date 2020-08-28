import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import memoizeOne from 'memoize-one';

import SlotTable from './SlotTable';

import { selectCourse } from '../../reducers/course';
import { addCourse } from '../../reducers/timetable';

import State from '../../models/State';
import { SlotTableContainerProps } from '../../models/components/SlotTable/SlotTable';
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

const mapStateToProps = (state: State, ownProps: SlotTableContainerProps) => ({
	selectedCourse: state.course.selected,
	slots: selectFilteredSlots(state),
	clashesWith: selectClashingSlots(state),
	checkSelected: checkSelected(state),
	ownProps,
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
	/>
);

export default connector(SlotTableContainer);
