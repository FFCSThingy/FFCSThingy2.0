import TimetableCourse from '../../data/TimetableCourse';

export default interface TimetableProps {
	timetable: TimetableCourse[];
	filledSlots: string[];
}
