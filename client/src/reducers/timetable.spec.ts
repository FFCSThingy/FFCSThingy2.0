import timetable, {
	initialState,
} from './timetable';

describe('timetable reducer', () => {
	it('should handle initial state', () => {
		expect.hasAssertions();
		expect(timetable(undefined, { type: '' })).toStrictEqual(initialState);
	});
});
