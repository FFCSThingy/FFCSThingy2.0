import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import SlotTable from './SlotTable';

import { selectCourse } from '../../reducers/course';

import State from '../../models/State';
import { SlotTableContainerProps } from '../../models/components/SlotTable/SlotTable';

const mapStateToProps = (state: State, ownProps: SlotTableContainerProps) => ({
	selectedCourse: state.course.selected,
	ownProps,
});

const mapDispatch = { selectCourse };

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SlotTableContainer: FC<PropsFromRedux> = (props) => (
	<SlotTable
        selectedCourse={props.selectedCourse}
        selectedCourseSlots={props.ownProps.selectedCourseSlots}

        addSlotToTimetable={props.ownProps.addSlotToTimetable}
        slotClashesWith={props.ownProps.slotClashesWith}
        isSelected={props.ownProps.isSelected}
	/>
);

export default connector(SlotTableContainer);
