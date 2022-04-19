import React from 'react';
import { Provider } from 'react-redux';
import Store from './components/Store';
import SceneModal from './components/SceneModal';
import store from './redux_stores';

const App = () =>
(
	<Provider store={store}>
		<Store store={store} />
		<SceneModal store={store} />
	</Provider>
);
export default App;
