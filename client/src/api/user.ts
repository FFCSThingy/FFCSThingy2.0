import axiosBase from './axiosBase';

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
