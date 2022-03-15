import { SET_COMPONENT_CONFIG } from './types';

// eslint-disable-next-line import/prefer-default-export
export const setComponentConfig = (data) => ({
	type: SET_COMPONENT_CONFIG,
	payload: data,
});
