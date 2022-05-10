import { SET_CART_DATA } from './types';
import { setCartData } from './actions';

const initialState = {
	item: 0,
	setCartData,
};

export default function cartReducer(state = initialState, action = {}) {
	const { type, payload } = action;

	switch (type) {
		case SET_CART_DATA:
			return { ...state, item: payload };
		default:
			return state;
	}
}
