import { SET_MODAL_PROPS, SET_MODAL_VISIBILITY } from './types';

export const setModalProps = (key, props) => ({
	type: SET_MODAL_PROPS,
	key,
	props,
});

export const setModalVisibility = (key, state) => ({
	type: SET_MODAL_VISIBILITY,
	key,
	state,
});
