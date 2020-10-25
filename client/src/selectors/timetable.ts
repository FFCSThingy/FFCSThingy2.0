import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../app/rootReducer';

export const selectTimetable = (state: RootState) => state.timetable.data;
export const selectTimetableNames = (state: RootState) => state.timetable.names;
export const selectActiveTimetableName = (state: RootState) => state.timetable.active;
export const selectTimetableTimestamp = (state: RootState) => state.timetable.timestamp;
export const selectClashmap = (state: RootState) => state.timetable.clashmap;
export const selectCreditCount = (state: RootState) => state.timetable.creditCount;
export const selectFilledSlots = (state: RootState) => state.timetable.filledSlots;
export const selectIsTimetableSyncing = (state: RootState) => state.timetable.syncing;

export const selectFilteredTimetable = createSelector(
	[selectTimetable, selectActiveTimetableName],
	(timetable, active) => timetable.filter((v) => v.timetableName === active),
);
