import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Dashboard from './Dashboard';

import { setHeatmap } from '../reducers/course';

import State from '../models/state/State';
import { DashboardContainerProps } from '../models/components/Dashboard';

const mapStateToProps = (state: State, ownProps: DashboardContainerProps) => ({
	ownProps,
});

const mapDispatch = { setHeatmap };

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SlotTableContainer: FC<PropsFromRedux> = (props) => (
	<Dashboard
		handleUnauth={props.ownProps.handleUnauth}
		setHeatmap={props.setHeatmap}
	/>
);

export default connector(SlotTableContainer);
