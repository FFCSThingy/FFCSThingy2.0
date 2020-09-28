import UserDetails, { CompletedCourses } from '../data/UserDetails';

export default interface UserSlice {
	details: UserDetails;
	completedCourses: CompletedCourses;
}
