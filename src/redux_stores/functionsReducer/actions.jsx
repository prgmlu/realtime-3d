import { REGISTER_SHAREABLE, SET_FUNCTIONS } from './types';

// eslint-disable-next-line import/prefer-default-export
export const setFunctions = (data) => ({
	type: SET_FUNCTIONS,
	payload: data,
});

export const registerShareable = (data) => ({
	type: REGISTER_SHAREABLE,
	payload: data,
});
