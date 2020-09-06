import axiosBase from './axiosBase';

export async function getCurriculumPrefixes() {
	const response = await axiosBase.get('/curriculum/prefixes');
	const { data } = response;

	if (!data.success) {
		throw data.message;
	}
	return data.data.filter((v: string) => !!v);
}

export async function getCurriculumByPrefix(prefix: string = '19BCE') {
	const response = await axiosBase.get(`curriculum/curriculumFromPrefix/${prefix}`);
	const { data } = response;

	if (!data.success || !data.data) {
		throw data.message;
	}
	return data.data;
}
