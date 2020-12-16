import { RootState } from '../app/rootReducer';

export const selectCompletedCourses = (state: RootState) => state.user.completedCourses;
export const selectUserDetails = (state: RootState) => state.user.details;
