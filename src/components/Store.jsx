import React, { Component } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';
import Lights from './Lights';
import AvatarCreator from './AvatarCreator';
import CharacterControls from './characterControls';
import CollisionDetection from './CollisionDetection';
import {ItemCollection, getRaycastIntersects} from './items';
import Animations from './static/glb_files/animations.glb';
import ProductsCart from './ui/ProductsCart.jsx';
import UI_Layer from './ui/UI_Layer';
import SceneModal from './SceneModal';
import CartModal from './ui/CartModal';
import defaultChar from './static/glb_files/defaultChar.glb';


const USE_NEW_STORE_WALLS = false;

const createBoundingObj = (position) => {
    const objGeometry = new THREE.SphereGeometry( 1, 32, 32);
    const objMaterial = new THREE.MeshBasicMaterial({transparent:true, opacity:0});
    const boundingObj = new THREE.Mesh(objGeometry, objMaterial);
	boundingObj.position.set(position.x, position.y, position.z);
    return boundingObj
}


export default class Store extends Component {
	constructor(props){
		super(props)
		this.reduxStore = props?.store;
		this.canvas = {};
		this.renderer = {};
		this.scene = new THREE.Scene();
		window.mainScene = this.scene;
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.orbitControls = {};
		this.characterControls = {};
		this.loader = new GLTFLoader();
		this.collisionDetection = new CollisionDetection([]);
		this.loader.crossOrigin = true;
		this.animations = {};
	}
	state = {
		sceneModal : false,
		modalItem : {},
		cartModal : false,
		cartItems : [],
		itemNum: 1,
	}

	loadAvatar = (avatar) => {
    
        this.loader.load(avatar, (data) => {
            this.loader.load(Animations, (anims) => {
                this.animations = anims.animations
                const model = data.scene;
                model.traverse(function (object) {
                    object.material && (object.material.envMapIntensity = 1.81);
                    if (object.isMesh) object.castShadow = true;
                });
                
                // model.rotation.y = Math.PI;
                model.position.y = 0.1;
                model.position.x = 0;
                model.position.z = USE_NEW_STORE_WALLS?0:6;
                
                let objPos = {x:model.position.x, y:1, z:model.position.z};
                model.boundingObj = createBoundingObj(objPos);
                this.scene.add(model);
                this.scene.add(model.boundingObj);
                
                const charAnimations = this.animations;
                const mixer = new THREE.AnimationMixer(model);
                const animationsMap = new Map();
                charAnimations.filter(a => a.name != 'TPose').forEach((a) => {
                    animationsMap.set(a.name, mixer.clipAction(a));
                });
                
                this.characterControls = new CharacterControls(model, mixer, animationsMap, this.orbitControls, this.camera, 'Idle',this.collisionDetection, this.items );
                
            });
        });
    }

	closeSceneModal = () => {
		this.setState({sceneModal:false, modalItem:{}});
	}

	addToCart = (itemID) => {
		let cartItems = this.state.cartItems;
		cartItems.push({itemID:itemID, itemNum:this.state.itemNum});
		let newItemNum = this.state.itemNum+1;
		this.setState({cartItems: cartItems, itemNum: newItemNum});
	}

	setCartItems = (items) => {
		this.setState({cartItems: items});
	}

	setCartModal = () => {
		let showCartModal = !this.state.cartModal;
		this.setState({cartModal : showCartModal});
	}

	componentDidMount() {
		window.addEventListener('click', (e)=>{
			var hit = getRaycastIntersects(e,this.camera);
			if (
				hit &&
				hit.length
			) {
				var point = hit[0].point;
				var id = hit[0].object.userData.id;
				var clickedItem = this.items.getItemById(id);
				var camDistance = this.camera.position.length();
				var originalPos = this.camera.position.clone();
				var targetPos = new THREE.Vector3(point.x, point.y, point.z);
				targetPos.normalize().multiplyScalar(-camDistance);
				new TWEEN.Tween(originalPos)
					.to(
						{
							x: targetPos.x,
							y: targetPos.y,
							z: targetPos.z,
						},
						1200,
					)
					.easing(TWEEN.Easing.Cubic.Out)
					.onUpdate(() => {
						this.camera.position.x = originalPos.x;
						this.camera.position.y = originalPos.y;
						this.camera.position.z = originalPos.z;
					})
					.start()
					.onComplete(() => {
					this.setState({
						sceneModal : true,
						modalItem : clickedItem,
					})
						//
					}, this);
			}
		})

		window.addEventListener('resize', ()=>{
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        })

		this.canvas = document.getElementById('webgl');
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.physicallyCorrectLights = true
		this.renderer.outputEncoding = THREE.sRGBEncoding;

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
		const Light = new Lights(this.scene, this.renderer);
		Light.setUpEnvMapLights(true);

		//STORE OBJECTS
		this.items = new ItemCollection(this.scene, this.loader, this.camera, this.renderer, USE_NEW_STORE_WALLS)
		this.items.putItems();
		this.collisionDetection.setCollisionObjects(this.items.getAllObjectsParts())

		//CLOCK
		const clock = new THREE.Clock();

		this.loadAvatar(defaultChar);

		const animate = () => {

			let mixerUpdateDelta = clock.getDelta();
			if (this.characterControls.update) {
				this.characterControls.update(mixerUpdateDelta, keysPressed);
			}
			this.orbitControls.update();
			this.renderer.render(this.scene, this.camera);
			TWEEN.update();
			let indiDist = this.items.easeOutBounce((clock.elapsedTime % 2) / 2);
			for(let i=0; i<this.items.items.length; i++){
				if(this.items.items[i].interact && this.items.items[i].indicator.position){
					let initPos = this.items.items[i].position.y + 0.75;
					this.items.items[i].indicator.position.y = initPos - (indiDist * 0.5);
				}
			}

			requestAnimationFrame(animate);
		}

		animate();
	}

	render() {
		return (
			<div className="Store" style={{width:window.innerWidth, height:window.innerHeight, overflow:'hidden'}}>
				{this.state.sceneModal && <SceneModal item={this.state.modalItem} closeModal={this.closeSceneModal} addToCart={this.addToCart}/>}
				<canvas id='webgl'></canvas>
				<AvatarCreator/>
				<UI_Layer/>
				<ProductsCart cartItems={this.state.cartItems} showModal={this.setCartModal}/>
				{this.state.cartModal && <CartModal 
											storeItems={this.items.items}
											cartItems={this.state.cartItems}
											setCartItems={this.setCartItems}
										/>}
			</div>
		)
	}
}