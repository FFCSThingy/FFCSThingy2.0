import { RootState } from '../app/rootReducer';

export const selectHeatmapTimestamp = (state: RootState) => state.course.heatmap.timestamp;
export const selectListsTimestamp = (state: RootState) => state.course.lists.timestamp;
