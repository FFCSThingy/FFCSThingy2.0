import { initialState } from '../app/rootReducer';
import TimetableCourse from '../models/data/TimetableCourse';
import {
	selectFilteredTimetable,
	selectActiveTimetableName,
	selectTimetable,
	selectTimetableTimestamp,
	selectClashmap,
	selectTimetableNames,
} from './timetable';

const courseDefault: TimetableCourse = {
	_id: 'DefaultId',
	code: 'ZZZ1001',
	title: 'Sample1',
	course_type: 'ETH',
	credits: 2,
	faculty: 'Faculty1',
	slot: 'A1',
	venue: 'SJT',
	timetableName: 'Default',
	simpleCourseType: 'Theory',
};
const courseSample: TimetableCourse = {
	_id: 'SampleId',
	code: 'ZZZ1002',
	title: 'Sample2',
	course_type: 'ETH',
	credits: 2,
	faculty: 'Faculty2',
	slot: 'A1',
	venue: 'SJT',
	timetableName: 'Sample',
	simpleCourseType: 'Theory',
};
const timetable: TimetableCourse[] = [courseDefault, courseSample];

const state = {
	...initialState,
	timetable: {
		...initialState.timetable,
		active: 'Sample',
		names: ['Default', 'Sample'],
		data: timetable,
		timestamp: new Date(Date.now()).toISOString(),
	},
};

describe('selectors: timetable', () => {
	it('selectFilteredtimetable', () => {
		expect.hasAssertions();
		const timetableName = 'Sample';
		const filteredTimetable: TimetableCourse[] = [courseSample];

		expect(
			selectFilteredTimetable.resultFunc(timetable, timetableName),
		).toStrictEqual(filteredTimetable);
	});

	it('selectTimetable', () => {
		expect.hasAssertions();
		expect(selectTimetable(state))
			.toStrictEqual(timetable);
	});

	it('selectTimetableNames', () => {
		expect.hasAssertions();
		expect(selectTimetableNames(state))
			.toStrictEqual(state.timetable.names);
	});

	it('selectActiveTimetableName', () => {
		expect.hasAssertions();
		expect(selectActiveTimetableName(state))
			.toStrictEqual(state.timetable.active);
	});

	it('selectTimetableTimestamp', () => {
		expect.hasAssertions();
		expect(selectTimetableTimestamp(state))
			.toStrictEqual(state.timetable.timestamp);
	});

	it('selectClashmap', () => {
		expect.hasAssertions();
		expect(selectClashmap(state))
			.toStrictEqual(state.timetable.clashmap);
	});
});
