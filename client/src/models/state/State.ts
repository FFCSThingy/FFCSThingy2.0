import HeatmapCourse from '../data/HeatmapCourse';

import TimetableSlice from './TimetableSlice';

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
	timetable: TimetableSlice,
}
