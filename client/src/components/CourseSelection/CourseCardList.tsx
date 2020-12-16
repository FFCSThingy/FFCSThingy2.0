import React, { FC } from 'react';
import { CardColumns } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import CourseCard from './CourseCard';

import styles from '../../css/CourseSelectionList.module.scss';

import CourseCardListProps from '../../models/components/CourseSelection/CourseCardList';
import { selectPrereqList, selectSelectedCourse } from '../../selectors/course';
import { selectCompletedCourses } from '../../selectors/user';

const CourseCardList: FC<CourseCardListProps> = ({
	filteredCourseList = {},
}) => {
	const selectedCourse = useSelector(selectSelectedCourse);
	const prereqList = useSelector(selectPrereqList);
	const completedCourses = useSelector(selectCompletedCourses);

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
