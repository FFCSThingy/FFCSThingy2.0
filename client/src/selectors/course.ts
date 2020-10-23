import { RootState } from '../app/rootReducer';

export const selectHeatmapTimestamp = (state: RootState) => state.course.heatmap.timestamp;
export const selectListsTimestamp = (state: RootState) => state.course.lists.timestamp;
export const selectSelectedCourse = (state: RootState) => state.course.selected;
export const selectPrereqList = (state: RootState) => state.course.lists.req;
export const selectHeatmap = (state: RootState) => state.course.heatmap.data;
