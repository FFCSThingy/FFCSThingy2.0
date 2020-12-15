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
	syncTimetable,
	// Utility functions
	convertHeatmapToTimetableCourse,
	checkExistsInArray,
	findFilledSlots,
	countCredits,
} from './timetable';

import clashmap from '../constants/ClashMap';
import TimetableCourse from '../models/data/TimetableCourse';
import Clashmap from '../models/constants/Clashmap';
import TimetableSlice from '../models/state/TimetableSlice';
import HeatmapCourse from '../models/data/HeatmapCourse';

describe('timetable reducer', () => {
	const mockStore = configureStore();
	const store = mockStore();

	const timeEpoch = Date.now();
	const timestamp: string = new Date(timeEpoch).toISOString();
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
					payload: {
						course: heatmapCourse2,
						timeEpoch,
					},
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
					payload: {
						course: heatmapCourse2,
						timeEpoch,
					},
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
					payload: {
						course: course2,
						timeEpoch,
					},
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
					payload: {
						course: {
							...course2,
							// Reducer works on the expectation that the _id is unique
							_id: 'someRandomID',
						},
						timeEpoch,
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
					payload: {
						course: course1,
						timeEpoch,
					},
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

	describe('thunks', () => {
		// TODO: Add tests by calling the thunk directly
		// store.dispatch(<thunk>(...args))

		// beforeEach(() => {
		// 	store.clearActions();
		// });

		describe(`${syncTimetable.typePrefix}`, () => {
			it('pending: shouldnt change any data, should update syncing status', () => {
				expect.hasAssertions();
				const action = {
					type: syncTimetable.pending,
					payload: undefined,
				};

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual({ ...bothCourseDefaultSelected, syncing: true });
			});

			describe('fulfilled', () => {
				const action = {
					type: syncTimetable.fulfilled,
					payload: {
						timetable: bothCourseDefaultSelected.data,
						timestamp: bothCourseDefaultSelected.timestamp,
					},
				};

				it('should update all fields in an empty state with received data', () => {
					expect.hasAssertions();

					expect(timetable(undefined, action))
						.toStrictEqual(bothCourseDefaultSelected);
				});

				it('should replace existing data with received data', () => {
					expect.hasAssertions();

					expect(timetable(onlyDefaultCourse, action))
						.toStrictEqual(bothCourseDefaultSelected);
				});

				it('should not switch timetables if active timetable exists in received data', () => {
					expect.hasAssertions();

					expect(timetable(onlyDefaultCourseSampleSelected, action))
						.toStrictEqual(bothCourseSampleSelected);
				});

				it('should maintain local timetable names and active state even if not present in received data', () => {
					expect.hasAssertions();
					const thisAction = {
						type: syncTimetable.fulfilled,
						payload: {
							timetable: onlyDefaultCourseSampleSelected.data,
							timestamp: onlyDefaultCourseSampleSelected.timestamp,
						},
					};

					expect(timetable(bothCourseSampleSelected, thisAction))
						.toStrictEqual(onlyDefaultCourseSampleSelected);
				});
			});

			it('rejected: shouldnt change any data, should update syncing status', () => {
				expect.hasAssertions();
				const action = {
					type: syncTimetable.rejected,
					payload: undefined,
				};

				expect(timetable(bothCourseDefaultSelected, action))
					.toStrictEqual({ ...bothCourseDefaultSelected, syncing: false });
			});
		});
	});

	describe('utility functions', () => {
		it('should convert from HeatmapCourse to TimetableCourse', () => {
			expect.hasAssertions();

			expect(convertHeatmapToTimetableCourse('Sample', heatmapCourse2))
				.toStrictEqual(course2);
		});

		it('should check if course exists in a given timetable using its _id field', () => {
			expect.hasAssertions();
			const course3 = {
				...course2,
				_id: 'someRandomID',
			};

			expect(checkExistsInArray(bothCourseDefaultSelected.data, course1))
				.toBeTruthy();

			expect(checkExistsInArray(bothCourseDefaultSelected.data, course2))
				.toBeTruthy();

			expect(checkExistsInArray(bothCourseDefaultSelected.data, course3))
				.toBeFalsy();
		});

		it('should be able to get a list of filled slots from a timetable', () => {
			expect.hasAssertions();

			expect(findFilledSlots(bothCourseDefaultSelected.data, 'Default'))
				.toStrictEqual(['A1', 'TA1']);

			expect(findFilledSlots(bothCourseSampleSelected.data, 'Sample'))
				.toStrictEqual(['B1', 'TB1']);
		});

		it('should count credits of a given timetable', () => {
			expect.hasAssertions();

			expect(countCredits(bothCourseDefaultSelected.data, 'Default'))
				.toStrictEqual(3);

			expect(countCredits(bothCourseSampleSelected.data, 'Sample'))
				.toStrictEqual(3);
		});
	});
});
