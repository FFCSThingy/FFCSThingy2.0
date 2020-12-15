import CourseReqs from '../../data/CourseReqs';

export default interface CourseCardProps {
	code: string;
	title: string;
	credits: number;
	shortCourseTypes: string[];
	completed?: string;
	selected?: boolean;
	prereqs?: CourseReqs;
}

export interface PrereqTextProps {
	value: string;
}
