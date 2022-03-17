import React, { Component } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CharacterControls from './characterControls';
import mainChar from './static/glb_files/Soldier.glb'
import {items, putItems} from './items'


export default class Store extends Component {

	componentDidMount() {
		const scene = new THREE.Scene();
		const canvas = document.getElementById('webgl');
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas,
		});
		renderer.setSize(window.innerWidth, window.innerHeight);

		const light = new THREE.SpotLight(0xffffff, 0.8);
		light.angle = Math.PI / 3;
		light.position.set(0, 10, 0);
		scene.add(light);

		scene.add(new THREE.AmbientLight(0xffffff, 0.7));

		const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

		// CONTROLS
		const orbitControls = new OrbitControls(camera, renderer.domElement);
		orbitControls.enableDamping = true;
		orbitControls.minDistance = 2;
		orbitControls.maxDistance = 5;
		orbitControls.enablePan = false;
		orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
		orbitControls.update();

		let characterControls = {};

		const loader = new GLTFLoader();
		loader.crossOrigin = true;

		loader.load(mainChar, function (data) {

			const model = data.scene;
			model.traverse(function (object) {
				if (object.isMesh) object.castShadow = true;
			});

			scene.add(model);

			const charAnimations = data.animations;
			const mixer = new THREE.AnimationMixer(model);
			const animationsMap = new Map()
			charAnimations.filter(a => a.name != 'TPose').forEach((a) => {
				animationsMap.set(a.name, mixer.clipAction(a))
			})

			characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera,  'Idle');
		});

		// CONTROL KEYS
		let keysPressed = {};
		document.addEventListener('keydown', (e) => {
			(keysPressed)[e.key.toLowerCase()] = true
		}, false);
		document.addEventListener('keyup', (e) => {
			(keysPressed)[e.key.toLowerCase()] = false
		}, false);

		putItems(scene, loader, items);

		const clock = new THREE.Clock();

		function animate() {

			let mixerUpdateDelta = clock.getDelta();
			if (characterControls.update) {
				characterControls.update(mixerUpdateDelta, keysPressed);
			}

			orbitControls.update();
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		}

		animate();
	}

	render() {
		return (
			<div className="Store">
				<canvas id='webgl'></canvas>
			</div>
		)
	}
}