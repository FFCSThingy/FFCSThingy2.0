import axiosBase from './axiosBase';

export async function getUserDetails() {
    const detailsResponse = await axiosBase.get('/account');
    const { data } = detailsResponse;
    return data;
}

export async function getCompletedCourses() {
    const detailsResponse = await axiosBase.get('/user/completedCourses');
    const { data } = detailsResponse;

    if (!data.success) {
        return {};
    }
    return data.data;
}
