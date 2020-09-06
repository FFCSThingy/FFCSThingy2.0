import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Dashboard from './Dashboard';

import {
	setCurrentCurriculumData,
} from '../reducers/curriculum';

import { RootState } from '../app/rootReducer';
import { DashboardContainerProps } from '../models/components/Dashboard';

const mapStateToProps = (state: RootState, ownProps: DashboardContainerProps) => ({
	ownProps,
});

const mapDispatch = {
	setCurrentCurriculumData,
};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const DashboardContainer: FC<PropsFromRedux> = (props) => (
	<Dashboard
		handleUnauth={props.ownProps.handleUnauth}
		setCurrentCurriculumData={props.setCurrentCurriculumData}
	/>
);

export default connector(DashboardContainer);
