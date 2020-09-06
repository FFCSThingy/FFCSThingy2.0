import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import CourseCardList from './CourseCardList';

import { selectCourse } from '../../reducers/course';

import { RootState } from '../../app/rootReducer';
import { CourseCardListContainerProps } from '../../models/components/CourseSelection/CourseCardList';

const mapStateToProps = (state: RootState, ownProps: CourseCardListContainerProps) => ({
	selectedCourse: state.course.selected,
	prereqList: state.course.lists.req,
	completedCourses: state.user.completedCourses,
	ownProps,
});

const mapDispatch = { selectCourse };

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const CourseCardListContainer: FC<PropsFromRedux> = (props) => (
	<CourseCardList
		filteredCourseList={props.ownProps.filteredCourseList}
		prereqList={props.prereqList}
		completedCourses={props.completedCourses}
		selectedCourse={props.selectedCourse}
		selectCourse={props.selectCourse}
	/>
);

export default connector(CourseCardListContainer);
