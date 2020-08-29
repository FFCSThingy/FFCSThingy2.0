import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import SelectedCoursesTable from './SelectedCoursesTable';
import { removeCourse } from '../../reducers/timetable';
import selectFilteredTimetable from '../../selectors/selectFilteredTimetable';

import State from '../../models/state/State';

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
