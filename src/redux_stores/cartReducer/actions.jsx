import { SET_CART_DATA } from './types';

// eslint-disable-next-line import/prefer-default-export
export const setCartData = (data) => ({
	type: SET_CART_DATA,
	payload: data,
});
