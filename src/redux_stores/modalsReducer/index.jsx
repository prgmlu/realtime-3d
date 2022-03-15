import { SET_MODAL_PROPS, SET_MODAL_VISIBILITY } from './types';

const initialState = {};

export default function modalReducer(state = initialState, action = {}) {
	const { type } = action;
	switch (type) {
		case SET_MODAL_PROPS: {
			const { key, props } = action;
			const newState = {
				...state,
			};
			newState[key] = props;
			return newState;
		}
		case SET_MODAL_VISIBILITY: {
			const newState = {
				...state,
			};
			if (!(action.key in newState)) {
				newState[action.key] = {};
			}
			newState[action.key].visible = action.state;
			return newState;
		}
		default:
			return state;
	}
}
