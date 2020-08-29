import TimetableCourse from '../../data/TimetableCourse';

export default interface SelectedCoursesTableProps {
	timetable: TimetableCourse[];
	creditCount: number;
	unselectSlot: Function;
}
