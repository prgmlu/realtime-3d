import React, { Component } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CharacterControls from './characterControls';
import AvatarCreator from './avatarCreator';
import Animations from './static/glb_files/animations.glb'
import defaultChar from './static/glb_files/defaultChar.glb'
import {items, putItems} from './items'


const  USE_AVATAR_CREATOR = false;

const createBoundingObj = (position) => {
    const objGeometry = new THREE.CylinderGeometry( .5, .5);
    const objMaterial = new THREE.MeshBasicMaterial({transparent:true, opacity:0});
    const boundingObj = new THREE.Mesh(objGeometry, objMaterial);
	boundingObj.position.set(position.x, position.y, position.z);
    return boundingObj
}


export default class Store extends Component {
	constructor(){
		super()
		this.canvas = {};
		this.renderer = {};
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.orbitControls = {};
		this.characterControls = {};
		this.loader = new GLTFLoader();
		this.loader.crossOrigin = true;
		this.animations = this.loader.load(Animations, (data) => {this.animations = data.animations});
	}

	loadAvatar = (avatar) => {
	
		this.loader.load(avatar, (data) => {
			const model = data.scene;
			model.traverse(function (object) {
				if (object.isMesh) object.castShadow = true;
			});

			model.rotation.y = Math.PI;
			model.position.x = 0;
			model.position.z = 6;

			let objPos = {x:model.position.x, y:1, z:model.position.z};
			model.boundingObj = createBoundingObj(objPos);
			this.scene.add(model);
			this.scene.add(model.boundingObj);

			const charAnimations = this.animations;
			const mixer = new THREE.AnimationMixer(model);
			const animationsMap = new Map();
			charAnimations.filter(a => a.name != 'TPose').forEach((a) => {
				animationsMap.set(a.name, mixer.clipAction(a));
			})
			this.characterControls = new CharacterControls(model, mixer, animationsMap, this.orbitControls, this.camera, 'Idle');
		});
	}

	parse = (event) => {
		try{
			return JSON.parse(event.data);
		}
		catch(error){
			console.log(error);
		}
	}

	subscribe = (event) =>{

		const json = this.parse(event);
	
		if (json?.source !== 'readyplayerme') {
			return;
		}
	
		// Susbribe to all events sent from Ready Player Me once frame is ready
		if (json.eventName === 'v1.frame.ready') {

			frame.contentWindow.postMessage(
			JSON.stringify({
				target: 'readyplayerme',
				type: 'subscribe',
				eventName: 'v1.**'
			}),
			'*'
			);
		}
	
		// Get avatar GLB URL
		if (json.eventName === 'v1.avatar.exported') {

			this.loadAvatar(json.data.url);
			document.getElementById('frame').hidden = true;
		}
	
		// Get user id
		if (json.eventName === 'v1.user.set') {

			console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
		}
	}

	componentDidMount() {
		this.canvas = document.getElementById('webgl');
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		// CONTROLS
		this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
		this.orbitControls.minDistance = 2;
		this.orbitControls.maxDistance = 5;
		this.orbitControls.enablePan = false;
		this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
		this.orbitControls.update();

		// CONTROL KEYS
		let keysPressed = {};
		document.addEventListener('keydown', (e) => {
			(keysPressed)[e.key.toLowerCase()] = true;
		}, false);
		document.addEventListener('keyup', (e) => {
			(keysPressed)[e.key.toLowerCase()] = false;
		}, false);

		//LIGHTS
		const light = new THREE.SpotLight(0xffffff, 0.8);
		light.angle = Math.PI / 3;
		light.position.set(0, 10, 0);
		this.scene.add(light);
		this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));

		//STORE OBJECTS
		putItems(this.scene, this.loader, items);

		//CLOCK
		const clock = new THREE.Clock();

		if ( USE_AVATAR_CREATOR ) {
			//READY PLAYER ME API
			const frame = document.getElementById('frame');
			frame.src = ' https://obsessvr.readyplayer.me/avatar?frameApi';
			document.getElementById('frame').hidden = false;
			window.addEventListener('message', this.subscribe);
			document.addEventListener('message', this.subscribe);
		}
		else{
			//DEFAULT CHARACTER
			this.loadAvatar(defaultChar);
		}

		const animate = () => {

			let mixerUpdateDelta = clock.getDelta();
			if (this.characterControls.update) {
				this.characterControls.update(mixerUpdateDelta, keysPressed);
			}
			this.orbitControls.update();
			this.renderer.render(this.scene, this.camera);
			requestAnimationFrame(animate);
		}

		animate();
	}

	render() {
		return (
			<div className="Store">
				<canvas id='webgl'></canvas>
				{USE_AVATAR_CREATOR && <AvatarCreator/>}
			</div>
		)
	}
}