import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import TimetableSwitcher from './TimetableSwitcher';

import {
	changeTimetable,
	addTimetable,
	removeTimetable,
	renameTimetable,
	copyTimetable,
} from '../../reducers/timetable';

import { RootState } from '../../app/rootReducer';

const mapStateToProps = (state: RootState) => ({
	names: state.timetable.names,
	active: state.timetable.active,
});

const mapDispatch = {
	changeTimetable,
	addTimetable,
	removeTimetable,
	renameTimetable,
	copyTimetable,
};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const TimetableSwitcherContainer: FC<PropsFromRedux> = (props) => (
	<TimetableSwitcher
		timetableNames={props.names}
		activeTimetableName={props.active}
		setActiveTimetableName={props.changeTimetable}
		doNew={props.addTimetable}
		doEdit={props.renameTimetable}
		doDelete={props.removeTimetable}
		doCopy={props.copyTimetable}
	/>
);

export default connector(TimetableSwitcherContainer);
