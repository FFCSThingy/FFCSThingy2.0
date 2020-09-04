import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import CourseSelection from './CourseSelection';

import State from '../../models/state/State';
import { CourseSelectionContainerProps } from '../../models/components/CourseSelection/CourseSelection';

const mapStateToProps = (state: State, ownProps: CourseSelectionContainerProps) => ({
	selectedCurriculumPrefix: state.curriculum.selectedPrefix,
	selectedCurriculum: state.curriculum.currentData,
	ownProps,
});

const mapDispatch = {};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const CourseSelectionContainer: FC<PropsFromRedux> = (props) => (
	<CourseSelection
		completedCourses={props.ownProps.completedCourses}
		selectedCurriculum={props.selectedCurriculum}
		selectedCurriculumPrefix={props.selectedCurriculumPrefix}
	/>
);

export default connector(CourseSelectionContainer);
