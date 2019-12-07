import axios from 'axios';

var API = axios.create({
	baseURL: (process.env.NODE_ENV === 'development') ? 
		'' : process.env.REACT_APP_BASE_URL
});

API.interceptors.response.use(response => {
	return response;
}, error => {
	if (error.response.status === 401) {
		console.log("Got 401");
	}
	return Promise.reject(error);
});

export default API;