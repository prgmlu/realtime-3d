import * as THREE from 'three';

export const createScene = () => {
    var scene = new THREE.Scene();
    return scene;
};
export const createRenderer = () => {

    var renderer = new THREE.WebGLRenderer({
		antialias: false,
		alpha: true,
		// preserveDrawingBuffer: true,
	});
	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = THREE.sRGBEncoding;

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xffcaca, 0);
	renderer.domElement.style.touchAction = 'none';

    return renderer
};
