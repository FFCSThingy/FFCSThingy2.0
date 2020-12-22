import course, {
	selectCourse,
	fetchHeatmap,
	fetchAllCourseLists,
	initialState,
} from './course';

describe('course reducer', () => {
	it('should handle initial state', () => {
		expect.hasAssertions();
		expect(course(undefined, { type: '' })).toStrictEqual(initialState);
	});

	describe('actions', () => {
		describe(`${selectCourse}`, () => {
			it('should update selected course code in state', () => {
				expect.hasAssertions();
				const action = {
					type: selectCourse.type,
					payload: 'ZZZ1001',
				};

				expect(
					course(
						{ ...initialState },
						action,
					),
				).toStrictEqual({
					...initialState,
					selected: 'ZZZ1001',
				});
			});
		});
	});

	describe('thunks', () => {
		describe(`${fetchHeatmap.typePrefix}`, () => {
			it('pending: shouldnt change any data, should update syncing status', () => {
				expect.hasAssertions();

				const state = course(
					{ ...initialState },
					fetchHeatmap.pending,
				);
				expect(state.heatmap.syncing).toBeTruthy();
			});

			it('fulfilled: should update state with received data', () => {
				expect.hasAssertions();
				const sampleData = {
					heatmap: [
						{
							_id: '5f59ffe5cee64f31983a2a92',
							code: 'ZZZ1001',
							course_type: 'PJT',
							credits: 2,
							faculty: 'ACADEMICS',
							slot: 'NIL',
							venue: 'NIL',
							__v: 0,
							count: 1,
							percent: 100,
							shortCourseType: 'P',
							simpleCourseType: 'Project',
							timestamp: '2020-09-29T09:00:00.007Z',
							title: 'Course 1001',
							total: 1,
						},
					],
					timestamp: new Date(Date.now()).toISOString(),
				};

				const action = {
					type: fetchHeatmap.fulfilled,
					payload: sampleData,
				};

				const state = course(
					{ ...initialState },
					action,
				);
				expect(state.heatmap.syncing).toBeFalsy();
				expect(state.heatmap.data).toStrictEqual(sampleData.heatmap);
				expect(state.heatmap.timestamp).toStrictEqual(sampleData.timestamp);
			});

			it('rejected: shouldnt change any data, should update syncing status', () => {
				expect.hasAssertions();

				const state = course(
					{ ...initialState },
					fetchHeatmap.rejected,
				);
				expect(state.heatmap.syncing).toBeFalsy();
			});
		});

		describe(`${fetchAllCourseLists.typePrefix}`, () => {
			it('fulfilled: should update state with received data', () => {
				expect.hasAssertions();
				const sampleData = {
					courseList: {
						ZZZ1001: {
							credits: 3,
							title: 'Course 1001',
							types: ['TH'],
							simpleCourseTypes: ['Theory'],
							shortCourseTypes: ['T'],
						},
					},
					courseSlotList: {
						A1: ['ZZZ1001', 'ZZZ1002'],
						B1: ['ZZZ1003'],
					},
					courseFacultyList: {
						FAC1: ['ZZZ1001'],
						FAC2: ['ZZZ1002'],
					},
					courseTypeList: {
						Lab: ['ZZZ1001'],
						Theory: ['ZZZ1002'],
						Project: ['ZZZ1003'],
					},
					prerequisites: {
						ZZZ1002: {
							prereq: 'ZZZ1001',
							coreq: '',
							antireq: '',
						},
					},
					timestamp: new Date(Date.now()).toISOString(),
				};

				const action = {
					type: fetchAllCourseLists.fulfilled,
					payload: sampleData,
				};

				const state = course(
					{ ...initialState },
					action,
				);
				expect(state.lists.course).toStrictEqual(sampleData.courseList);
				expect(state.lists.faculty).toStrictEqual(sampleData.courseFacultyList);
				expect(state.lists.slot).toStrictEqual(sampleData.courseSlotList);
				expect(state.lists.type).toStrictEqual(sampleData.courseTypeList);
				expect(state.lists.req).toStrictEqual(sampleData.prerequisites);
				expect(state.lists.timestamp).toStrictEqual(sampleData.timestamp);
			});
		});
	});
});
