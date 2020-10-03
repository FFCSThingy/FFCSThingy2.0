import configureStore from 'redux-mock-store';
import timetable, {
	initialState,
	addTimetable,
	addCourse,
	changeTimetable,
	clearLocalData,
	copyTimetable,
	removeTimetable,
	removeCourse,
	renameTimetable,
} from './timetable';

import clashmap from '../constants/ClashMap';
import TimetableCourse from '../models/data/TimetableCourse';
import Clashmap from '../models/constants/Clashmap';
import TimetableSlice from '../models/state/TimetableSlice';
import HeatmapCourse from '../models/data/HeatmapCourse';

describe('timetable reducer', () => {
	const mockStore = configureStore();
	const store = mockStore();

	const timestamp: string = new Date(Date.now()).toISOString();
	const course1: TimetableCourse = {
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
	const course2: TimetableCourse = {
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
	const heatmapCourse2: HeatmapCourse = {
		...course2,
		__v: 0,
		shortCourseType: 'T',
		count: 0,
		total: 0,
		percent: 0,
		timestamp: '',
	};
	const course1Clashmap: Clashmap = {
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
	const course2Clashmap: Clashmap = {
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

	const bothCourseDefaultSelected: TimetableSlice = {
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
	const bothCourseSampleSelected: TimetableSlice = {
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
	const onlyDefaultCourse: TimetableSlice = {
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
	const onlyDefaultCourseSampleSelected: TimetableSlice = {
		active: 'Sample',
		names: ['Default', 'Sample'],
		filledSlots: [],
		data: [
			{ ...course1 },
		],
		timestamp,
		creditCount: 0,
		syncing: false,
		clashmap: { ...clashmap },
	};

	it('should handle initial state', () => {
		expect.hasAssertions();
		expect(timetable(undefined, { type: '' })).toStrictEqual(initialState);
	});

	describe('timetable actions', () => {
		beforeEach(() => {
			store.clearActions();
		});

		describe(`${addTimetable}`, () => {
			const action = {
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

				store.dispatch(addTimetable(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(undefined, action)).toStrictEqual(finalState);
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

				store.dispatch(addTimetable(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				// To check that active timetable does not change
				// and that a duplicate isn't added
				expect(timetable(initState, action)).toStrictEqual(finalState);
			});
		});

		describe(`${changeTimetable}`, () => {
			it('should change to an existing timetable', () => {
				expect.hasAssertions();
				const action = {
					type: changeTimetable.type,
					payload: 'Sample',
				};

				store.dispatch(changeTimetable(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual(bothCourseSampleSelected);
			});

			it('should not change to a non-existent timetable', () => {
				expect.hasAssertions();
				const action = {
					type: changeTimetable.type,
					payload: 'NonExistent',
				};

				store.dispatch(changeTimetable(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual(bothCourseDefaultSelected);
			});

			it('should do nothing on changing to active timetable', () => {
				expect.hasAssertions();
				const action = {
					type: changeTimetable.type,
					payload: 'Default',
				};

				store.dispatch(changeTimetable(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual(bothCourseDefaultSelected);
			});
		});

		describe(`${removeTimetable}`, () => {
			const action = {
				type: removeTimetable.type,
				payload: undefined,
			};

			it('should remove current timetable', () => {
				expect.hasAssertions();

				store.dispatch(removeTimetable());
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseSampleSelected, action))
					.toStrictEqual(onlyDefaultCourse);
			});

			it('should not remove current if Default', () => {
				expect.hasAssertions();

				store.dispatch(removeTimetable());
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual(bothCourseDefaultSelected);
			});
		});

		describe(`${renameTimetable}`, () => {
			const action = {
				type: renameTimetable.type,
				payload: 'NewName',
			};

			it('should rename current timetable', () => {
				expect.hasAssertions();

				const finalState = {
					...bothCourseSampleSelected,
					active: 'NewName',
					names: ['Default', 'NewName'],
					data: [
						{ ...course1 },
						{ ...course2, timetableName: 'NewName' },
					],
				};

				store.dispatch(renameTimetable(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseSampleSelected, action))
					.toStrictEqual(finalState);
			});

			it('should not rename Default timetable', () => {
				expect.hasAssertions();

				store.dispatch(renameTimetable(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual(bothCourseDefaultSelected);
			});

			it('should not rename current to a name that exists', () => {
				expect.hasAssertions();
				const thisAction = {
					type: renameTimetable.type,
					payload: 'Sample',
				};

				store.dispatch(renameTimetable(thisAction.payload));
				expect(store.getActions()).toStrictEqual([thisAction]);

				expect(timetable(bothCourseSampleSelected, thisAction))
					.toStrictEqual(bothCourseSampleSelected);
			});
		});

		describe(`${copyTimetable}`, () => {
			it('should copy current timetable', () => {
				expect.hasAssertions();
				const action = {
					type: copyTimetable.type,
					payload: 'NewName',
				};

				const finalState = {
					...bothCourseSampleSelected,
					active: 'NewName',
					names: ['Default', 'Sample', 'NewName'],
					data: [
						{ ...course1 },
						{ ...course2 },
						{
							...course2,
							timetableName: 'NewName',
						},
					],
				};

				store.dispatch(copyTimetable(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseSampleSelected, action))
					.toStrictEqual(finalState);
			});

			it(
				'should copy current timetable with generated name if no name given',
				() => {
					expect.hasAssertions();
					const action = {
						type: copyTimetable.type,
						payload: '',
					};

					const finalState = {
						...bothCourseSampleSelected,
						active: 'Sample-Copy',
						names: ['Default', 'Sample', 'Sample-Copy'],
						data: [
							{ ...course1 },
							{ ...course2 },
							{
								...course2,
								timetableName: 'Sample-Copy',
							},
						],
					};

					store.dispatch(copyTimetable(action.payload));
					expect(store.getActions()).toStrictEqual([action]);

					expect(timetable(bothCourseSampleSelected, action))
						.toStrictEqual(finalState);
				},
			);

			it('should not copy if new name already exists', () => {
				expect.hasAssertions();
				const action = {
					type: copyTimetable.type,
					payload: 'Sample',
				};

				store.dispatch(copyTimetable(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual(bothCourseDefaultSelected);
			});
		});

		describe(`${addCourse}`, () => {
			it('should add course if it doesnt exist in current timetable', () => {
				expect.hasAssertions();
				const action = {
					type: addCourse.type,
					// Change payload to include timestamp once reducer is changed
					// TODO: Change this course to HeatmapCourse instead of TimetableCourse
					payload: heatmapCourse2,
				};

				store.dispatch(addCourse(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(onlyDefaultCourseSampleSelected, action))
					.toStrictEqual(bothCourseSampleSelected);
			});

			it('should not add course if it exists in current timetable', () => {
				expect.hasAssertions();
				const action = {
					type: addCourse.type,
					// Change payload to include timestamp once reducer is changed
					// TODO: Change this course to HeatmapCourse instead of TimetableCourse
					payload: heatmapCourse2,
				};

				store.dispatch(addCourse(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseSampleSelected, action))
					.toStrictEqual(bothCourseSampleSelected);
			});
		});

		describe(`${removeCourse}`, () => {
			it('should remove course if it exists in current timetable', () => {
				expect.hasAssertions();
				const action = {
					type: removeCourse.type,
					// Change payload to include timestamp once reducer is changed
					payload: course2,
				};

				store.dispatch(removeCourse(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseSampleSelected, action))
					.toStrictEqual(onlyDefaultCourseSampleSelected);
			});

			it('should not remove course if it doesnt exist in current timetable', () => {
				expect.hasAssertions();
				const action = {
					type: removeCourse.type,
					// Change payload to include timestamp once reducer is changed
					payload: {
						...course2,
						// Reducer works on the expectation that the _id is unique
						_id: 'someRandomID',
					},
				};

				store.dispatch(removeCourse(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseSampleSelected, action))
					.toStrictEqual(bothCourseSampleSelected);
			});

			it('should not remove courses that are not in the active timetable', () => {
				expect.hasAssertions();
				const action = {
					type: removeCourse.type,
					// Change payload to include timestamp once reducer is changed
					payload: course1,
				};

				store.dispatch(removeCourse(action.payload));
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseSampleSelected, action))
					.toStrictEqual(bothCourseSampleSelected);
			});
		});

		describe(`${clearLocalData}`, () => {
			it('should clear all local timetable data', () => {
				expect.hasAssertions();
				const action = {
					type: clearLocalData.type,
					payload: undefined,
				};

				store.dispatch(clearLocalData());
				expect(store.getActions()).toStrictEqual([action]);

				expect(timetable(bothCourseSampleSelected, action))
					.toStrictEqual(initialState);
			});
		});
	});
});
