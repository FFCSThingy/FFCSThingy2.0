import TimetableCourse from '../../data/TimetableCourse';
import HeatmapCourse from '../../data/HeatmapCourse';

export default interface SelectedCoursesTableProps {
	timetable: HeatmapCourse[];
	creditCount: number;
	unselectSlot: Function;
}

export interface SelectedCoursesTableContainerProps {
	unselectSlot: Function;
}
