import axiosBase from './axiosBase';

export async function getHeatmap(timestamp: string = '') {
	const response = await axiosBase.get(`/course/fullHeatmap/${timestamp}`);
	const { data } = response;

	if (!data.success || !data.data) {
		throw data.message;
	}
	return data.data;
}

export async function getAllCourseLists(timestamp: string = '') {
	const response = await axiosBase.get(`/course/allCourseLists/${timestamp}`);
	const { data } = response;

	if (!data.success || !data.data) {
		throw data.message;
	}
	return data.data;
}
