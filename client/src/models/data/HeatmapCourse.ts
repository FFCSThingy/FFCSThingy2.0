export default interface HeatmapCourse {
	_id: string;
	__v: number;

	code: string;
	title: string;
	slot: string;
	course_type: string;
	simpleCourseType: string;
	shortCourseType: string;
	credits: number;
	faculty: string;
	venue: string;

	count: number;
	total: number;
	percent: number;
	timestamp: string;
}
