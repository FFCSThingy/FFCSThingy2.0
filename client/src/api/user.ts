import axiosBase from './axiosBase';
import TimetableCourse from '../models/data/TimetableCourse';

export async function getUserDetails() {
	const response = await axiosBase.get('/account');
	const { data } = response;
	return data;
}

export async function getCompletedCourses() {
	const response = await axiosBase.get('/user/completedCourses');
	const { data } = response;

	if (!data.success) {
		throw data.message;
	}
	return data.data;
}

export async function getTimetable(timestamp: string) {
	const response = await axiosBase.get('/user/selectedCourses');
	const { data } = response;

	if (!data.success || !data.data) {
		throw data.message;
	}
	return data.data;
}

export async function postTimetable(
	timetable: TimetableCourse[],
	timestamp: string,
) {
	const reqData = { selected_courses: timetable, timestamp };
	const response = await axiosBase.post('/user/selectedCoursesBulk', reqData);
	const { data } = response;

	if (!data.success) {
		throw data.message;
	}
	return data.data;
}
