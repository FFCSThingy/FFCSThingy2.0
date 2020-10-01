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
	});
});
