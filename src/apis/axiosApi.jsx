import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import config from 'config';

// const cachedRequests = {};

const instance = axios.create({
	baseURL: config.API_URL,
	crossDomain: true,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

const handleSuccess = (response) => response;

const handleError = ({ error }) => Promise.reject(error);

instance.interceptors.response.use(handleSuccess, handleError);

export default instance;
