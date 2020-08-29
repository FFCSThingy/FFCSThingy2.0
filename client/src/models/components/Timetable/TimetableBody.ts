import TimetableCourse from '../../data/TimetableCourse';

export interface TimetableBodyRowProps {
	timetable: TimetableCourse[];
	rowNumber: number;
	isMobile?: boolean;
	isAfternoon?: boolean;
	filledSlots: string[];
}

export default interface TimetableBodyProps {
	timetable: TimetableCourse[];
	isMobile?: boolean;
	isAfternoon?: boolean;
	filledSlots: string[];
}
