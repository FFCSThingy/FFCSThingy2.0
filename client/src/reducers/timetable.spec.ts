import timetable, {
	initialState,
	addTimetable,
} from './timetable';

describe('timetable reducer', () => {
	it('should handle initial state', () => {
		expect.hasAssertions();
		expect(timetable(undefined, { type: '' })).toStrictEqual(initialState);
	});

	describe('timetable actions', () => {
		describe(`${addTimetable.type}`, () => {
			it('should handle new timetable (no duplicates)', () => {
				expect.hasAssertions();

				expect(
					timetable(
						undefined,
						{
							type: addTimetable.type,
							payload: 'Sample',
						},
					),
				).toStrictEqual({
					...initialState,
					active: 'Sample',
					names: ['Default', 'Sample'],
				});
			});

			it('should handle new timetable (new name already present)', () => {
				expect.hasAssertions();

				// To check that active timetable does not change
				expect(
					timetable(
						{
							...initialState,
							active: 'Default',
							names: ['Default', 'Sample'],
						},
						{
							type: addTimetable.type,
							payload: 'Sample',
						},
					),
				).toStrictEqual({
					...initialState,
					active: 'Default',
					names: ['Default', 'Sample'],
				});

				expect(
					timetable(
						{
							...initialState,
							active: 'Sample',
							names: ['Default', 'Sample'],
						},
						{
							type: addTimetable.type,
							payload: 'Sample',
						},
					),
				).toStrictEqual({
					...initialState,
					active: 'Sample',
					names: ['Default', 'Sample'],
				});
			});
		});
	});
});
