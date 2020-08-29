import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import SelectedCoursesTable from './SelectedCoursesTable';
import { removeCourse } from '../../reducers/timetable';

import State from '../../models/State';

const selectTimetable = (state: State) => state.timetable.data;
const selectActiveTimetableName = (state: State) => state.timetable.active;

const selectFilteredTimetable = createSelector(
	[selectTimetable, selectActiveTimetableName],
	(timetable, active) => timetable.filter((v) => v.timetableName === active),
);

const mapStateToProps = (state: State) => ({
	creditCount: state.timetable.creditCount,
	timetable: selectFilteredTimetable(state),
});

const mapDispatch = { removeCourse };

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SelectedCoursesTableContainer: FC<PropsFromRedux> = (props) => (
	<SelectedCoursesTable
		timetable={props.timetable}
		unselectSlot={props.removeCourse}
		creditCount={props.creditCount}
	/>
);

export default connector(SelectedCoursesTableContainer);
