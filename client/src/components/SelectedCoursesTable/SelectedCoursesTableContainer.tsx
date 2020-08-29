import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import SelectedCoursesTable from './SelectedCoursesTable';

import State from '../../models/State';
import { SelectedCoursesTableContainerProps } from '../../models/components/SelectedCoursesTable/SelectedCoursesTable';

const mapStateToProps = (state: State, ownProps: SelectedCoursesTableContainerProps) => ({
	creditCount: state.timetable.creditCount,
	ownProps,
});

const mapDispatch = {};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SelectedCoursesTableContainer: FC<PropsFromRedux> = (props) => (
	<SelectedCoursesTable
        timetable={props.ownProps.timetable}
        unselectSlot={props.ownProps.unselectSlot}
        activeTimetableName={props.ownProps.activeTimetableName}
        creditCount={props.creditCount}
	/>
);

export default connector(SelectedCoursesTableContainer);
