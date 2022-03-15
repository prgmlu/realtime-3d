// Disabling import config as it eslint is unable to tell that it is coming from webpack externals.
// eslint-disable-next-line import/no-unresolved
import axiosApi from './axiosApi';
import { setScenes } from '../redux_stores/scenesReducer/actions';
import componentConfig from './sampleComponentMap';
import { setComponentConfig } from '../redux_stores/componentConfigReducer/actions';
import { setStoreData } from '../redux_stores/storeDataReducer/actions';

export const getStoreData = (storeId) => (dispatch) =>
	axiosApi
		.get(`/v1/store-with-id?id=${storeId}`)
		.then((res) => dispatch(setStoreData(res.data)))
		.catch((err) => Promise.reject(err.response));

export const getAllScenes = (storeId) => (dispatch) =>
	axiosApi
		.get(`/v1/scene/all?id=${storeId}`)
		.then((res) => {
			dispatch(setScenes(res.data));
		})
		.catch((err) => Promise.reject(err.response));

export const getSceneObjects = (sceneId) =>
	axiosApi
		.get(`/v2/scene/objects?id=${sceneId}`)
		.then((res) => res.data)
		.catch((err) => Promise.reject(err.response));

export const getComponentConfig = (storeId) => (dispatch) =>
	dispatch(setComponentConfig(componentConfig[storeId]));
