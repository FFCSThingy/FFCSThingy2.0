import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Timetable from './Timetable';
import selectFilteredTimetable from '../../selectors/selectFilteredTimetable';

import State from '../../models/State';

const mapStateToProps = (state: State) => ({
	timetable: selectFilteredTimetable(state),
	filledSlots: state.timetable.filledSlots,
});

const mapDispatch = {};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const TimetableContainer: FC<PropsFromRedux> = (props) => (
	<Timetable
		filledSlots={props.filledSlots}
		timetable={props.timetable}
	/>
);

export default connector(TimetableContainer);
