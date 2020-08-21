import HeatmapCourse from '../../data/HeatmapCourse';

export default interface SlotCardProps {
	slotDetails: HeatmapCourse;
	type: string;
	clashingSlots?: string[];
	onClick?: Function;
}
