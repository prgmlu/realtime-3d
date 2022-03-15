import { SET_SCENES } from './types';

const initialState = {};

export default function scenesReducer(state = initialState, action = {}) {
	const { type, payload } = action;
	switch (type) {
		case SET_SCENES: {
			const newScenes = {};
			payload.forEach((item) => {
				newScenes[item.id] = item;
			});
			return {
				...state,
				...newScenes,
			};
		}
		default:
			return state;
	}
}
