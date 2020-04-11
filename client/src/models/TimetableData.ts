export default interface TimetableData {
	_id: string;
	code: string;
	course_type: string;
	credits: number;
	faculty: string;
	slot: string;
	venue: string;
	title: string;
	timetableName: string;
	simpleCourseType: string;
	percent?: number;
}