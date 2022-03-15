// eslint-disable-next-line import/no-unresolved
// import modules from 'product_data_module/modules';
import { REGISTER_SHAREABLE, SET_FUNCTIONS } from './types';
import axiosApi from '../../apis/axiosApi';
import { formURL } from '../../utils/apiUtils';

const initialState = {
	axios: axiosApi,
	formURL,
};

export default function functionsReducer(state = initialState, action = {}) {
	const { type, payload } = action;
	switch (type) {
		case SET_FUNCTIONS:
			return { ...payload };
		case REGISTER_SHAREABLE: {
			return { ...state, ...payload };
		}
		default:
			return state;
	}
}
