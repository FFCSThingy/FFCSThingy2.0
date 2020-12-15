import { RootState } from '../app/rootReducer';

export const selectSelectedPrefix = (state: RootState) => state.curriculum.selectedPrefix;
export const selectCurrentCurriculumData = (state: RootState) => state.curriculum.currentData;
export const selectCurriculumList = (state: RootState) => state.curriculum.list;
