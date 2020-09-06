import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import CourseSelection from './CourseSelection';

import {
	setCourseList,
	setCourseFacultyList,
	setCourseSlotList,
	setCourseTypeList,
	setReqList,
} from '../../reducers/course';

import { RootState } from '../../app/rootReducer';

const mapStateToProps = (state: RootState) => ({
	selectedCurriculumPrefix: state.curriculum.selectedPrefix,
	selectedCurriculum: state.curriculum.currentData,
	courseList: state.course.lists.course,
	courseFacultyList: state.course.lists.faculty,
	courseSlotList: state.course.lists.slot,
	courseTypeList: state.course.lists.type,
});

const mapDispatch = {
	setCourseList,
	setCourseFacultyList,
	setCourseSlotList,
	setCourseTypeList,
	setReqList,
};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const CourseSelectionContainer: FC<PropsFromRedux> = (props) => (
	<CourseSelection
		selectedCurriculum={props.selectedCurriculum}
		selectedCurriculumPrefix={props.selectedCurriculumPrefix}

		courseList={props.courseList}
		courseFacultyList={props.courseFacultyList}
		courseSlotList={props.courseSlotList}
		courseTypeList={props.courseTypeList}

		setCourseList={props.setCourseList}
		setCourseFacultyList={props.setCourseFacultyList}
		setCourseSlotList={props.setCourseSlotList}
		setCourseTypeList={props.setCourseTypeList}
		setReqList={props.setReqList}
	/>
);

export default connector(CourseSelectionContainer);
