import { SET_SEND_EVENTS_ARR } from './types';

const initialState = {
	sendEventsArr: [],
};

export default function analyticsReducer(state = initialState, action = {}) {
	const { type, payload } = action;

	switch (type) {
		case SET_SEND_EVENTS_ARR:
			return { sendEventsArr: [...state.sendEventsArr, payload] };
		default:
			return state;
	}
}
