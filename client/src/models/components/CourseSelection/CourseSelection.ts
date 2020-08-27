import { Curriculum } from '../../data/Curriculum';

export default interface CourseSelectionProps {
	selectedCurriculum: Curriculum;
	selectedCurriculumPrefix: string;
	completedCourses: {
		[key: string]: string;
	};
}
