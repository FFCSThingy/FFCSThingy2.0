import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../app/rootReducer';

export const selectTimetable = (state: RootState) => state.timetable.data;
export const selectActiveTimetableName = (state: RootState) => state.timetable.active;
export const selectTimetableTimestamp = (state: RootState) => state.timetable.timestamp;

export const selectFilteredTimetable = createSelector(
	[selectTimetable, selectActiveTimetableName],
	(timetable, active) => timetable.filter((v) => v.timetableName === active),
);
