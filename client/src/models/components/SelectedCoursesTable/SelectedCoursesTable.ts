import TimetableCourse from '../../data/TimetableCourse';

export default interface SelectedCoursesTableProps {
	timetable: TimetableCourse[];
	activeTimetableName: string;
	creditCount: number;
	unselectSlot: Function;
}

export interface SelectedCoursesTableContainerProps {
	timetable: TimetableCourse[];
	activeTimetableName: string;
	unselectSlot: Function;
}
