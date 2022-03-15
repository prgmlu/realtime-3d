import { SET_SEND_EVENTS_ARR } from './types';

// eslint-disable-next-line import/prefer-default-export
export const setSendEventsArr = (data) => ({
	type: SET_SEND_EVENTS_ARR,
	payload: data,
});
