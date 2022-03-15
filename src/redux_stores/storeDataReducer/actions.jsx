import { SET_STORE_DATA } from './types';

// eslint-disable-next-line import/prefer-default-export
export const setStoreData = (data) => ({
	type: SET_STORE_DATA,
	payload: data,
});
