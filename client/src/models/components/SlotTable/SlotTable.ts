import HeatmapCourse from '../../data/HeatmapCourse';

export default interface SlotTableProps {
	selectedCourse: string;
	selectedCourseSlots: HeatmapCourse[];
	slotClashesWith: Function;
	isSelected: Function;
	addSlotToTimetable: Function;
}

export interface SlotTableContainerProps {
	selectedCourseSlots: HeatmapCourse[];
	slotClashesWith: Function;
	isSelected: Function;
	addSlotToTimetable: Function;
}