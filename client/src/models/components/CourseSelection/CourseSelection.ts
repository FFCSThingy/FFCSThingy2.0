import Curriculum from '../../data/Curriculum';

export default interface CourseSelectionProps {
	selectedCurriculum: Curriculum;
	selectedCurriculumPrefix: string;
	completedCourses: {
		[key: string]: string;
	};
}

export interface CourseSelectionContainerProps {
	completedCourses: {
		[key: string]: string;
	};
}
