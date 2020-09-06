import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Dashboard from './Dashboard';

import { setHeatmap } from '../reducers/course';
import {
	setSelectedCurriculum,
	setCurrentCurriculumData,
} from '../reducers/curriculum';

import { RootState } from '../app/rootReducer';
import { DashboardContainerProps } from '../models/components/Dashboard';

const mapStateToProps = (state: RootState, ownProps: DashboardContainerProps) => ({
	selectedCurriculum: state.curriculum.selectedPrefix,
	ownProps,
});

const mapDispatch = {
	setHeatmap,
	setSelectedCurriculum,
	setCurrentCurriculumData,
};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const DashboardContainer: FC<PropsFromRedux> = (props) => (
	<Dashboard
		handleUnauth={props.ownProps.handleUnauth}
		setHeatmap={props.setHeatmap}
		setSelectedCurriculum={props.setSelectedCurriculum}
		setCurrentCurriculumData={props.setCurrentCurriculumData}
		selectedCurriculum={props.selectedCurriculum}
	/>
);

export default connector(DashboardContainer);
