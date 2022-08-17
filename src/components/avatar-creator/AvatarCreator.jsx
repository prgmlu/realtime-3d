import React, { Component } from 'react';
import * as THREE from 'three';
import { createScene, createRenderer } from '../threeHelpers';
import Lights from '../Lights';
import AvatarCreatorEditor from './AvatarCreatorEditor';
import back from '../static/avatar/menus/back.png';
import Cookie from '../cookie';

class AvatarCreator extends Component {
	constructor(props) {
		super(props);
		this.scene = createScene();
		this.renderer = createRenderer();
		this.renderer.setSize(
			window.innerWidth * 0.3528,
			window.innerHeight * 0.6205,
		);
		this.camera = new THREE.PerspectiveCamera(
			50,
			(window.innerWidth * 0.3528) / (window.innerHeight * 0.6205),
			0.1,
			1000,
		);
		this.myRef = React.createRef();
		this.lastMPos = { x: 0, y: 0 };
		this.canRotate = false;
		this.currentAvatar = props?.currentAvatar;
		this.saveAvatar = props?.saveAvatar;
		this.closeModal = props?.closeModal;
	}

	state = {
		isCookieShown: false,
	};

	loadAvatar = () => {
		this.currentAvatar.position.set(0, -0.9, -2.7);
		this.currentAvatar.rotation.set(0, 0, 0, 'XYZ');
		this.scene.add(this.currentAvatar);
	};

	rotateAvatar = (e) => {
		if (!this.canRotate) return;
		//you can only calculate the distance if therer already was a mouse event
		if (e.touches && e.touches.length == 1) {
			if (typeof this.lastMPos.x != 'undefined') {
				//calculate how far the mouse has moved
				var deltaX = this.lastMPos.x - e.touches[0].clientX;

				if (this.first) {
					deltaX = 0;
				}
				this.first = false;

				//rotate your object accordingly
				this.currentAvatar.rotation.y -= deltaX * 0.03;
			}

			//save current mouse Position for next time
			this.lastMPos = {
				x: e.touches[0].clientX,
			};
		} else {
			if (typeof this.lastMPos.x != 'undefined') {
				//calculate how far the mouse has moved
				var deltaX = this.lastMPos.x - e.clientX;

				if (this.first) {
					deltaX = 0;
				}
				this.first = false;

				//rotate your object accordingly
				this.currentAvatar.rotation.y -= deltaX * 0.01;
			}

			//save current mouse Position for next time
			this.lastMPos = {
				x: e.clientX,
			};
		}
	};

	setZoom = (fov) => {
		this.camera.fov = fov;
		if (this.camera.fov < 1) this.camera.fov = 1;
		if (this.camera.fov > 50) this.camera.fov = 50;
		this.camera.updateProjectionMatrix();
	};

	mouseWheelHandler = (e) => {
		const fovDelta = e.deltaY;
		const temp = this.camera.fov + Math.round(fovDelta * 0.04);
		this.setZoom(temp);
	};

	handleRendererMouseMove = (e) => {
		this.rotateAvatar(e);
	};

	handleMouseDown = () => {
		this.canRotate = true;
		this.first = true;
	};

	handleMouseUp = () => {
		this.canRotate = false;
	};

	componentDidMount() {
		const Light = new Lights(this.scene, this.renderer);
		Light.setUpEnvMapLights();

		this.renderer.domElement.addEventListener(
			'wheel',
			this.mouseWheelHandler,
			{ passive: true },
		);
		this.renderer.domElement.addEventListener(
			'mousemove',
			this.handleRendererMouseMove,
			true,
		);
		this.renderer.domElement.addEventListener(
			'mouseup',
			this.handleMouseUp,
			true,
		);
		this.renderer.domElement.addEventListener(
			'mousedown',
			this.handleMouseDown,
			true,
		);

		this.myRef.current.appendChild(this.renderer.domElement);

		this.loadAvatar();

		this.animate();
	}

	animate = () => {
		requestAnimationFrame(this.animate);
		this.renderer.render(this.scene, this.camera);
	};

	handleClose = () => {
		this.setState({ isCookieShown: false });
	};

	render() {
		const { isCookieShown } = this.state;
		return (
			<div className="absolute flex flex-col items-center w-4/5 h-[85%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-10 pb-24 bg-gradient-to-t from-[#bdbdbd]  to-[#7e7d7d] rounded-md">
				<div className="absolute z-10 top-3 left-6  flex items-center gap-4">
					<button
						onClick={() => this.closeModal()}
						className="flex items-center text-white text-base px-2 py-1 gap-2 rounded-md cursor-pointer  bg-black"
					>
						<img src={back} alt="BACK" className="object-contain" />
						Back
					</button>
					<button
						onClick={() => this.setState({ isCookieShown: true })}
						className="text-white underline cursor-pointer text-base"
					>
						Cookie Policy
					</button>
				</div>
				<div className="w-full h-full flex items-center">
					<div
						className="w-1/2 flex items-center justify-center"
						ref={this.myRef}
					></div>
					<AvatarCreatorEditor currentScene={this.scene} />
				</div>
				{isCookieShown && <Cookie handleClose={this.handleClose} />}
			</div>
		);
	}
}

export default AvatarCreator;
