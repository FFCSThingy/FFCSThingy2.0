import { Curriculum } from '../../data/Curriculum';

export default interface CourseSelectionProps {
	selectedCurriculum: Curriculum;
	selectedCurriculumPrefix: string;
	selectedCourse: string;
	completedCourses: {
		[key: string]: string;
	};
	doSelectCourse: Function;
}
