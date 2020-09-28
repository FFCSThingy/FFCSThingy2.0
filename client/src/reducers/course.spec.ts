import course, { selectCourse, initialState } from './course';

describe('course reducer', () => {
	it('should handle initial state', () => {
		expect.hasAssertions();
		expect(course(undefined, { type: '' })).toStrictEqual(initialState);
	});

	it(`should handle ${selectCourse.type}`, () => {
		expect.hasAssertions();
		const action = {
			type: selectCourse.type,
			payload: 'MCK1001',
		};

		expect(
			course(
				{ ...initialState },
				action,
			),
		).toStrictEqual({
			...initialState,
			selected: 'MCK1001',
		});
	});
});
