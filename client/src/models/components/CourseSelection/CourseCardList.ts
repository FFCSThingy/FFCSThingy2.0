import { CourseList } from "../../data/CourseLists";
import RequisitesList from '../../data/RequisitesList';

export default interface CourseCardListProps {
	filteredCourseList: CourseList;
	selectedCourse: string;
	prereqList: RequisitesList;
	completedCourses: {
		[key: string]: string;
	};
	doSelectCourse: Function;
};