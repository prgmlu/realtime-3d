import { SET_IS_SHIFT_KEY_PRESSED } from './types';
import { setIsShiftKeyPressed } from './actions';

const initialState = {
	isShiftKeyPressed: false,
	setIsShiftKeyPressed,
};

export default function accessibilityReducer(
	state = initialState,
	action = {},
) {
	const { type, payload } = action;

	switch (type) {
		case SET_IS_SHIFT_KEY_PRESSED:
			return { ...state, isShiftKeyPressed: payload };
		default:
			return state;
	}
}
