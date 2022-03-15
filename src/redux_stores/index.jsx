import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

/**  Reducers * */
import scenesReducer from './scenesReducer';
import modalReducer from './modalsReducer';
import componentConfigReducer from './componentConfigReducer';
import storeDataReducer from './storeDataReducer';
import functionsReducer from './functionsReducer';
import analyticsReducer from './analyticsReducer';
import accessibilityReducer from './accessibilityReducer';

const staticReducers = {
	scenes: scenesReducer,
	storeData: storeDataReducer,
	modalData: modalReducer,
	componentConfig: componentConfigReducer,
	shareableFunctions: functionsReducer,
	analytics: analyticsReducer,
	accessibility: accessibilityReducer,
};

const createReducer = (asyncReducers) =>
	combineReducers({
		...staticReducers,
		...asyncReducers,
	});

const createEnhancers = () => {
	const middlewares = [thunk];
	const middlewareEnhancer = applyMiddleware(...middlewares);
	const enhancers = [middlewareEnhancer];
	return process.env.NODE_ENV === 'development'
		? composeWithDevTools(...enhancers)
		: compose(...enhancers);
};

const makeReduxStore = () => {
	const enhancers = createEnhancers();
	const store = createStore(createReducer({}), enhancers);

	store.asyncReducers = {};

	store.injectReducer = (key, asyncReducer) => {
		store.asyncReducers[key] = asyncReducer;
		store.replaceReducer(createReducer(store.asyncReducers));
		return store;
	};

	return store;
};

const store = makeReduxStore();
export default store;
