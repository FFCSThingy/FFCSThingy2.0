import MiscSlice from './MiscSlice';
import CourseSlice from './CourseSlice';
import TimetableSlice from './TimetableSlice';
import CurriculumSlice from './CurriculumSlice';
import UserSlice from './UserSlice';

export default interface StateModel {
	misc: MiscSlice,
	course: CourseSlice,
	timetable: TimetableSlice,
	curriculum: CurriculumSlice,
	user: UserSlice,
}
