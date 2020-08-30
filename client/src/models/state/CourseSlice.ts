import HeatmapCourse from '../data/HeatmapCourse';

export default interface CourseSlice {
	selected: string,
	heatmap: {
		timestamp : string | null,
		data: Array<HeatmapCourse>,
	}
}
