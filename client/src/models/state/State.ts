import HeatmapCourse from '../data/HeatmapCourse';
import TimetableCourse from '../data/TimetableCourse';
import Clashmap from '../constants/Clashmap';

export default interface StateModel {
	misc: {
		theme: string,
	},
	course: {
		selected: string,
		heatmap: {
			timestamp : Date,
			data: Array<HeatmapCourse>,
		}
	},
	timetable: {
		active: string,
		names: Array<string>,
		filledSlots: Array<string>,
		timestamp: string,
		data: Array<TimetableCourse>,
		clashmap: Clashmap,
		creditCount: number,
	}
}
