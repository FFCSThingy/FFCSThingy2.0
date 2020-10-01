import timetable, {
	initialState,
	addTimetable,
	changeTimetable,
	removeTimetable,
	renameTimetable,
} from './timetable';

import clashmap from '../constants/ClashMap';

describe('timetable reducer', () => {
	const timestamp = new Date(Date.now()).toISOString();
			const course1 = {
				_id: '5f59ffe5cee64f31983a29fe',
				code: 'ARB1001',
				course_type: 'TH',
				credits: 3,
				faculty: 'MOHD SAQIB',
				slot: 'A1+TA1',
				venue: 'SJT823',
				simpleCourseType: 'Theory',
				title: 'Arabic for Beginners',
				timetableName: 'Default',
			};
			const course2 = {
				_id: '5f59ffe5cee64f31983a29ff',
				code: 'ARB1001',
				course_type: 'TH',
				credits: 3,
				faculty: 'MOHD SAQIB',
				slot: 'B1+TB1',
				venue: 'SJT403',
				simpleCourseType: 'Theory',
				title: 'Arabic for Beginners',
				timetableName: 'Sample',
			};
	const course1Clashmap = {
					...clashmap,
					A1: {
						...clashmap.A1,
						isFilled: true,
						currentlyClashesWith: ['A1'],
					},
					TA1: {
						...clashmap.TA1,
						isFilled: true,
						currentlyClashesWith: ['TA1'],
					},
					L1: {
						...clashmap.L1,
						currentlyClashesWith: ['A1'],
					},
					L14: {
						...clashmap.L14,
						currentlyClashesWith: ['A1'],
					},
					L27: {
						...clashmap.L27,
						currentlyClashesWith: ['TA1'],
					},
			};
	const course2Clashmap = {
					...clashmap,
					B1: {
						...clashmap.B1,
						isFilled: true,
						currentlyClashesWith: ['B1'],
					},
					TB1: {
						...clashmap.TB1,
						isFilled: true,
						currentlyClashesWith: ['TB1'],
					},
					L4: {
						...clashmap.L4,
						currentlyClashesWith: ['TB1'],
					},
					L5: {
						...clashmap.L5,
						currentlyClashesWith: ['TB1'],
					},
					L7: {
						...clashmap.L7,
						currentlyClashesWith: ['B1'],
					},
					L20: {
						...clashmap.L20,
						currentlyClashesWith: ['B1'],
					},
	};

	const bothCourseDefaultSelected = {
		active: 'Default',
		names: ['Default', 'Sample'],
		filledSlots: ['A1', 'TA1'],
		data: [
			{ ...course1 },
			{ ...course2 },
		],
		timestamp,
		creditCount: 3,
		syncing: false,
		clashmap: course1Clashmap,
	};
	const bothCourseSampleSelected = {
		active: 'Sample',
		names: ['Default', 'Sample'],
		filledSlots: ['B1', 'TB1'],
		data: [
			{ ...course1 },
			{ ...course2 },
		],
		timestamp,
		creditCount: 3,
		syncing: false,
		clashmap: course2Clashmap,
	};
	const onlyDefaultCourse = {
		active: 'Default',
		names: ['Default'],
		filledSlots: ['A1', 'TA1'],
		data: [
			{ ...course1 },
		],
		timestamp,
		creditCount: 3,
		syncing: false,
		clashmap: course1Clashmap,
	};

	it('should handle initial state', () => {
		expect.hasAssertions();
		expect(timetable(undefined, { type: '' })).toStrictEqual(initialState);
	});

	describe('timetable actions', () => {
		describe(`${addTimetable}`, () => {
			const addAction = {
				type: addTimetable.type,
				payload: 'Sample',
			};

			it('should handle new timetable (no duplicates)', () => {
				expect.hasAssertions();

				const finalState = {
					...initialState,
					active: 'Sample',
					names: ['Default', 'Sample'],
				};

				expect(timetable(undefined, addAction)).toStrictEqual(finalState);
			});

			it('should handle new timetable (new name already present)', () => {
				expect.hasAssertions();

				const initState = {
					...initialState,
					active: 'Default',
					names: ['Default', 'Sample'],
				};

				const finalState = {
					...initialState,
					active: 'Default', // Active timetable should remain same
					names: ['Default', 'Sample'], // Sample shouldn't be added to the list again
				};

				// To check that active timetable does not change
				// and that a duplicate isn't added
				expect(timetable(initState, addAction)).toStrictEqual(finalState);
			});
		});

		describe(`${changeTimetable}`, () => {
			it('should change to an existing timetable', () => {
				expect.hasAssertions();

				const action = {
					type: changeTimetable.type,
					payload: 'Sample',
				};

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual(bothCourseSampleSelected);
			});

			it('should not change to a non-existent timetable', () => {
				expect.hasAssertions();

				const action = {
					type: changeTimetable.type,
					payload: 'NonExistent',
				};

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual(bothCourseDefaultSelected);
			});

			it('should do nothing on changing to active timetable', () => {
				expect.hasAssertions();

				const action = {
					type: changeTimetable.type,
					payload: 'Default',
				};

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual(bothCourseDefaultSelected);
			});
		});

		describe(`${removeTimetable}`, () => {
			const action = {
				type: removeTimetable.type,
			};

			it('should remove current timetable', () => {
				expect.hasAssertions();

				expect(timetable(bothCourseSampleSelected, action))
					.toStrictEqual(onlyDefaultCourse);
			});

			it('should not remove current if Default', () => {
				expect.hasAssertions();

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual(bothCourseDefaultSelected);
			});
			});
		});
	});
});
