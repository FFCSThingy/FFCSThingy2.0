import { CourseList } from '../../data/CourseLists';
import RequisitesList from '../../data/RequisitesList';

export default interface CourseCardListProps {
	filteredCourseList: CourseList;
	prereqList: RequisitesList;
	completedCourses: {
		[key: string]: string;
	};
	selectedCourse: string;
	selectCourse: Function;
}

export interface CourseCardListContainerProps {
	filteredCourseList: CourseList;
	completedCourses: {
		[key: string]: string;
	};
}
