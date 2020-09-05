import Curriculum from '../../data/Curriculum';
import {
	CourseList,
	CourseSlotList,
	CourseFacultyList,
	CourseTypeList,
} from '../../data/CourseLists';

export default interface CourseSelectionProps {
	selectedCurriculum: Curriculum;
	selectedCurriculumPrefix: string;

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
