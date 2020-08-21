import HeatmapCourse from '../../data/HeatmapCourse';

export default interface SlotTableProps {
	selectedCourseCode: string;
	selectedCourseSlots: HeatmapCourse[];
	slotClashesWith: Function;
	isSelected: Function;
	addSlotToTimetable: Function;
}
