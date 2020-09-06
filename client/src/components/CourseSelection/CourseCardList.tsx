import React, { FC } from 'react';
import { CardColumns } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import CourseCard from './CourseCard';

import styles from '../../css/CourseSelectionList.module.scss';

import CourseCardListProps from '../../models/components/CourseSelection/CourseCardList';
import { RootState } from '../../app/rootReducer';

const CourseCardList: FC<CourseCardListProps> = ({
	filteredCourseList = {},
}) => {
	const selectedCourse = useSelector(
		(state: RootState) => state.course.selected,
	);
	const prereqList = useSelector(
		(state: RootState) => state.course.lists.req,
	);
	const completedCourses = useSelector(
		(state: RootState) => state.user.completedCourses,
	);

	const completedCourseCards = Object.keys(filteredCourseList)
		.filter((code) => completedCourses && completedCourses[code])
		.map((code) => {
			const { title, credits, shortCourseTypes } = filteredCourseList[code];

			return (
				<CourseCard
					code={code}
					title={title}
					credits={credits}
					shortCourseTypes={shortCourseTypes}
					selected={(selectedCourse === code)}
					completed={completedCourses[code]}
					prereqs={prereqList[code]}
					key={`${code}-CourseCard`}
				/>
			);
		});

	const normalCards = Object.keys(filteredCourseList)
		.filter((code) => !completedCourses || (completedCourses && !completedCourses[code]))
		.map((code) => {
			const { title, credits, shortCourseTypes } = filteredCourseList[code];

			return (
				<CourseCard
					code={code}
					title={title}
					credits={credits}
					shortCourseTypes={shortCourseTypes}
					selected={(selectedCourse === code)}
					prereqs={prereqList[code]}
					key={`${code}-CourseCard`}
				/>
			);
		});

	return (
		<CardColumns className={styles.courseList}>
			{normalCards}
			{completedCourseCards}
		</CardColumns>
	);
};

export default CourseCardList;
