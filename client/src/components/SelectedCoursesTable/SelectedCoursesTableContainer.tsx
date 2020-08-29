import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import SelectedCoursesTable from './SelectedCoursesTable';

import State from '../../models/State';
import { SelectedCoursesTableContainerProps } from '../../models/components/SelectedCoursesTable/SelectedCoursesTable';

const selectTimetable = (state: State) => state.timetable.data;
const selectActiveTimetableName = (state: State) => state.timetable.active;

const selectFilteredTimetable = createSelector(
	[selectTimetable, selectActiveTimetableName],
	(timetable, active) => timetable.filter((v) => v.timetableName === active),
);

const mapStateToProps = (state: State, ownProps: SelectedCoursesTableContainerProps) => ({
	creditCount: state.timetable.creditCount,
	timetable: selectFilteredTimetable(state),
	ownProps,
});

const mapDispatch = {};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SelectedCoursesTableContainer: FC<PropsFromRedux> = (props) => (
	<SelectedCoursesTable
		timetable={props.timetable}
		unselectSlot={props.ownProps.unselectSlot}
		creditCount={props.creditCount}
	/>
);

export default connector(SelectedCoursesTableContainer);
