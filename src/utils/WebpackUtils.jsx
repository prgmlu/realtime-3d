import React, { useEffect } from 'react';

const loadComponent = async (scope, module) => {
	/** *
	 * Function to load components from a dynamically loaded container using
	 * Webpack 5 Modules Federation.
	 *
	 * Ref: https://webpack.js.org/concepts/module-federation/#dynamic-remote-containers
	 * ** */
	// Initializes the share scope. This fills it with known provided modules from this build and all remotes
	// eslint-disable-next-line no-undef
	await __webpack_init_sharing__('default');
	const container = window[scope]; // or get the container somewhere else
	// Initialize the container, it may provide shared modules
	// eslint-disable-next-line camelcase,no-undef
	await container.init(__webpack_share_scopes__.default);
	const factory = await window[scope].get(module);
	return factory();
};

const createElement = (
	url,
	onScriptLoaded = () => {},
	onScriptFailed = () => {},
) => {
	const element = document.createElement('script');
	element.src = url;
	element.type = 'text/javascript';
	element.async = true;
	element.onload = onScriptLoaded;
	element.onerror = onScriptFailed;
	return element;
};

const withDynamicScript = (remoteConfig, fallBackComponent) => {
	/**
	 * Dynamically loads a component from WP5 Modules Federation Container URL
	 * Loads the component from the container URL and passes to WrappedComponent
	 *
	 * Arguments:
	 * WrappedComponent: React Component class/function
	 * remoteConfig: Configuration for the remote container
	 * remoteConfig.url: URL of the container
	 * component.scope: scope of component (generally name from ModulesFederationPlugin.name)
	 * component.module: Exposed Module Path from ModulesFederationPlugin (e.g. ./SampleComponent)
	 *
	 * Returns: React.Lazy instance
	 *
	 * * */

	const [ready, setReady] = React.useState(false);
	const [failed, setFailed] = React.useState(false);
	const { url, scope, module } = remoteConfig;

	const onScriptLoaded = () => {
		setReady(true);
	};

	const onScriptFailed = () => {
		setReady(false);
		setFailed(true);
	};

	useEffect(() => {
		if (!url) {
			return;
		}
		setReady(false);
		setFailed(false);

		const element = createElement(url, onScriptLoaded, onScriptFailed);
		document.head.appendChild(element);
		// eslint-disable-next-line consistent-return
		return () => {
			document.head.removeChild(element);
		};
	}, [url]);

	if (!ready) {
		return () => fallBackComponent;
	}

	if (failed) {
		return () => fallBackComponent;
	}
	return React.lazy(() => loadComponent(scope, module));
};

export default { loadComponent, withDynamicScript, createElement };
