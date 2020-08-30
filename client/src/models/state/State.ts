import MiscSlice from './MiscSlice';
import CourseSlice from './CourseSlice';
import TimetableSlice from './TimetableSlice';

export default interface StateModel {
	misc: MiscSlice,
	course: CourseSlice,
	timetable: TimetableSlice,
}
