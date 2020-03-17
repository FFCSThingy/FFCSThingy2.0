import axios from 'axios';
import { makeUseAxios } from 'axios-hooks';

const ffcsAxios = axios.create({
	baseURL: (process.env.NODE_ENV === 'development') ? '' : process.env.REACT_APP_BASE_URL,
});

const useAxiosFFCS = makeUseAxios({
	axios: ffcsAxios,
});

export default useAxiosFFCS;
