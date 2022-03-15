import { SET_IS_SHIFT_KEY_PRESSED } from './types';

// eslint-disable-next-line import/prefer-default-export
export const setIsShiftKeyPressed = (data) => ({
	type: SET_IS_SHIFT_KEY_PRESSED,
	payload: data,
});
