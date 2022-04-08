import React, { Component } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CharacterControls from './characterControls';
import AvatarCreator from './avatarCreator';
import mainChar from './static/glb_files/Soldier.glb'
import {items, putItems} from './items'


const createBoundingObj = (position) => {
    const objGeometry = new THREE.CylinderGeometry( .5, .5);
    const objMaterial = new THREE.MeshBasicMaterial({transparent:true, opacity:0});
    const boundingObj = new THREE.Mesh(objGeometry, objMaterial);
	boundingObj.position.set(position.x, position.y, position.z);
    return boundingObj
}


export default class Store extends Component {

	componentDidMount() {
		const scene = new THREE.Scene();
		window.scene = scene;
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

		putItems(scene, loader, items);

		// CONTROL KEYS
		let keysPressed = {};
		document.addEventListener('keydown', (e) => {
			(keysPressed)[e.key.toLowerCase()] = true;
		}, false);
		document.addEventListener('keyup', (e) => {
			(keysPressed)[e.key.toLowerCase()] = false;
		}, false);

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
				<AvatarCreator/>
			</div>
		)
	}
}