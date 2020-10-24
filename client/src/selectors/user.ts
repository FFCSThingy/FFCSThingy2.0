import { RootState } from '../app/rootReducer';

export const selectCompletedCourses = (state: RootState) => state.user.completedCourses;
