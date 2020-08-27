import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import SlotTable from './SlotTable';

import { selectCourse } from '../../reducers/course';

import State from '../../models/State';
import { SlotTableContainerProps } from '../../models/components/SlotTable/SlotTable';

const selectHeatmap = (state: State) => state.course.heatmap.data;
const selectSelectedCourse = (state: State) => state.course.selected;
const selectFilteredSlots = createSelector(
	[selectHeatmap, selectSelectedCourse],
	(heatmap, selectedCourse) => heatmap.filter((course) => course.code === selectedCourse),
);

const mapStateToProps = (state: State, ownProps: SlotTableContainerProps) => ({
	selectedCourse: state.course.selected,
	slots: selectFilteredSlots(state),
	ownProps,
});

const mapDispatch = { selectCourse };

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SlotTableContainer: FC<PropsFromRedux> = (props) => (
	<SlotTable
		selectedCourse={props.selectedCourse}
		slots={props.slots}

		addSlotToTimetable={props.ownProps.addSlotToTimetable}
		slotClashesWith={props.ownProps.slotClashesWith}
		isSelected={props.ownProps.isSelected}
	/>
);

export default connector(SlotTableContainer);
