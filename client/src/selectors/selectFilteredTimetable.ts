import { createSelector } from '@reduxjs/toolkit';

import State from '../models/State';

const selectTimetable = (state: State) => state.timetable.data;
const selectActiveTimetableName = (state: State) => state.timetable.active;

const selectFilteredTimetable = createSelector(
	[selectTimetable, selectActiveTimetableName],
	(timetable, active) => timetable.filter((v) => v.timetableName === active),
);

export default selectFilteredTimetable;