import React, { Component } from 'react';
import * as THREE from 'three';
import { createScene, createRenderer } from '../threeHelpers';
import Lights from '../Lights';
import AvatarCreatorEditor from './AvatarCreatorEditor';
import back from '../static/avatar/menus/back.png';
import edit from '../static/avatar/menus/edit.png';

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
		username: '',
		isWindowSize: false,
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

	checkWindowSize = (value) => {
		this.setState({
			isWindowSize: value,
		});
		this.props.updateWindowSize(value);
	};

	render() {
		const { isCookieShown, username, isWindowSize } = this.state;
		return (
			<div
				className={`flex flex-col items-center justify-center w-[95%] sm:w-4/5 h-[95%] sm:h-[85%] md:h-[95%] lg:h-[85%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-[#7c6a6a] via-[#c1b8b8] to-[#FFF2F2] rounded-md ${
					isCookieShown && 'bg-white/50'
				} overflow-hidden absolute z-30`}
			>
				{!isWindowSize && (
					<div className="absolute w-full sm:w-fit z-10 top-3 left-0 sm:left-4 px-3 sm:px-0 flex justify-between sm:justify-start items-center">
						<button
							onClick={() => this.closeModal()}
							className="flex items-center text-white text-base px-2  py-2 sm:py-1 gap-2 rounded-md cursor-pointer bg-black mr-0 sm:mr-6"
						>
							<img
								src={back}
								alt="BACK"
								className="object-contain"
							/>
							Back
						</button>
						<button className="text-center text-black text-base px-6 py-2 sm:py-1 gap-2 rounded-md cursor-pointer bg-white mr-0 sm:mr-6">
							Save
						</button>
					</div>
				)}
				<div className="w-full h-full sm:h-3/4 md:h-[90%]  lg:h-3/4 flex flex-col sm:flex-row items-center">
					<div className="w-full sm:w-1/2 md:w-2/5 lg:w-1/2 h-1/2 sm:h-full flex flex-col items-center justify-start sm:justify-center">
						<div className="w-32 h-8 z-50 flex items-end justify-center mt-3 sm:mt-0">
							<div className="w-[25%] h-full flex items-center justify-center rounded-l-[4px] border-t-[1px] border-l-[1px] border-b-[1px] border-[#330D0D] bg-black">
								<img className="scale-90" src={edit} alt="" />
							</div>
							<input
								className="w-[75%] h-full outline-none text-center text-white text-sm rounded-r-[4px] px-1 py-1 mt-[11px] sm:mt-0 border-t-[1px] border-r-[1px] border-b-[1px] border-[#330D0D] bg-[#330d0d4d]"
								placeholder="Username"
								value={username}
								onChange={({ target }) =>
									this.setState({ username: target.value })
								}
							/>
						</div>
						<div
							ref={this.myRef}
							className="scale-75 sm:scale-100 md:scale-150 lg:scale-125"
						></div>
					</div>
					<AvatarCreatorEditor
						currentScene={this.scene}
						checkWindowSize={this.checkWindowSize}
					/>
				</div>
			</div>
		);
	}
}

export default AvatarCreator;
