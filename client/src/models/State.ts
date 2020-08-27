import HeatmapCourse from './data/HeatmapCourse';

export default interface StateModel {
	misc: {
		theme: string,
	},
	course: {
		selected: string,
		heatmap: Array<HeatmapCourse>,
		heatmapTimestamp : Date,
	},
}
