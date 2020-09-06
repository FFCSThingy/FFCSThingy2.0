import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Dashboard from './Dashboard';

import { setHeatmap } from '../reducers/course';
import {
	setPrefixList,
	setSelectedCurriculum,
	setCurrentCurriculumData,
} from '../reducers/curriculum';
import {
	setCompletedCourses,
	setUserDetails,
} from '../reducers/user';

import { RootState } from '../app/rootReducer';
import { DashboardContainerProps } from '../models/components/Dashboard';

const mapStateToProps = (state: RootState, ownProps: DashboardContainerProps) => ({
	selectedCurriculum: state.curriculum.selectedPrefix,
	ownProps,
});

const mapDispatch = {
	setHeatmap,
	setPrefixList,
	setSelectedCurriculum,
	setCurrentCurriculumData,
	setCompletedCourses,
	setUserDetails,
};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const DashboardContainer: FC<PropsFromRedux> = (props) => (
	<Dashboard
		handleUnauth={props.ownProps.handleUnauth}
		setHeatmap={props.setHeatmap}
		setPrefixList={props.setPrefixList}
		setSelectedCurriculum={props.setSelectedCurriculum}
		setCurrentCurriculumData={props.setCurrentCurriculumData}
		selectedCurriculum={props.selectedCurriculum}
		setCompletedCourses={props.setCompletedCourses}
		setUserDetails={props.setUserDetails}
	/>
);

export default connector(DashboardContainer);
