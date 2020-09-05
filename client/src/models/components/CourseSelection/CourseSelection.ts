import Curriculum from '../../data/Curriculum';
import {
	CourseList,
	CourseSlotList,
	CourseFacultyList,
	CourseTypeList,
} from '../../data/CourseLists';
import RequisitesList from '../../data/RequisitesList';

export default interface CourseSelectionProps {
	selectedCurriculum: Curriculum;
	selectedCurriculumPrefix: string;
	completedCourses: {
		[key: string]: string;
	};

	courseList: CourseList;
	courseFacultyList: CourseFacultyList;
	courseSlotList: CourseSlotList;
	courseTypeList: CourseTypeList;

	setCourseList: Function;
	setCourseFacultyList: Function;
	setCourseSlotList: Function;
	setCourseTypeList: Function;
	setReqList: Function;
}

export interface CourseSelectionContainerProps {
	completedCourses: {
		[key: string]: string;
	};
}
