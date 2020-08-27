import HeatmapCourse from '../../data/HeatmapCourse';

export default interface SlotTableProps {
	selectedCourse: string;
	slots: HeatmapCourse[];
	slotClashesWith: Function;
	isSelected: Function;
	addSlotToTimetable: Function;
}

export interface SlotTableContainerProps {
	slotClashesWith: Function;
	isSelected: Function;
	addSlotToTimetable: Function;
}