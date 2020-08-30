import TimetableCourse from '../data/TimetableCourse';
import Clashmap from '../constants/Clashmap';

export default interface TimetableSlice {
	active: string,
	names: Array<string>,
	filledSlots: Array<string>,
	timestamp: string | null,
	data: Array<TimetableCourse>,
	clashmap: Clashmap,
	creditCount: number,
}