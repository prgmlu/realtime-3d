import React, { Component } from 'react';
import * as THREE from 'three'
import {createScene, createRenderer} from '../threeHelpers'
import Lights from '../Lights';
import AvatarCreatorEditor from './AvatarCreatorEditor';
import './AvatarCreator.css'

class AvatarCreator extends Component {
    constructor(props) {
        super(props);
        this.sizes = {
            width: window.innerWidth * 0.3528,
            height: window.innerHeight * 0.6205
        }
        this.scene = createScene();
        this.renderer = createRenderer();
        this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.camera = new THREE.PerspectiveCamera(50, this.sizes.width / this.sizes.height, 0.1, 1000);
        this.myRef = React.createRef();
        this.lastMPos = {x: 0, y: 0};
        this.canRotate = false;
        this.currentAvatar = props?.currentAvatar;
        this.saveAvatar = props?.saveAvatar;
        this.closeModal = props?.closeModal;
    }

    loadAvatar = () => {
        this.currentAvatar.position.set(-0.5, -.9, -2.7);
        this.currentAvatar.rotation.set(0,0,0,'XYZ');

        this.scene.add(this.currentAvatar);
	}

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
    
    }

	setZoom = (fov) => {
		this.camera.fov = fov;
		if (this.camera.fov < 1) this.camera.fov = 1;
		if (this.camera.fov > 50) this.camera.fov = 50;
		this.camera.updateProjectionMatrix();
	}

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

        this.renderer.domElement.addEventListener('wheel', this.mouseWheelHandler, { passive: true });
        this.renderer.domElement.addEventListener('mousemove', this.handleRendererMouseMove, true);
        this.renderer.domElement.addEventListener('mouseup',this.handleMouseUp, true);
        this.renderer.domElement.addEventListener('mousedown',this.handleMouseDown, true);
        window.addEventListener('resize', () => {
            // Update sizes
            this.sizes.width = window.innerWidth * 0.3528
            this.sizes.height = window.innerHeight * 0.6205
        
            // Update camera
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()
        
            // Update renderer
            this.renderer.setSize(this.sizes.width, this.sizes.height)
        })

        this.myRef.current.appendChild(this.renderer.domElement);

        this.loadAvatar();
                
        this.animate();

    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        return (
            <div className='avatarCreator'>
                <div className='backButton' onClick={(e) => {this.closeModal();}} >
                    <svg className='group' width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L1 6L6 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 6H9C14.523 6 19 10.477 19 16V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className='backButtonText'>
                        Back
                    </div>
                </div>

                <div className="editorBody">
                    <div className='avatarCreatorScene' ref={this.myRef}></div>
                    <AvatarCreatorEditor currentScene={this.scene}/>
                </div>

                 {/* <div className="editorButtons">
                    <button type='button' className='cancelButton' onClick={this.closeModal}> Cancel </button>
                    <button type='button' className='saveButton' onClick={this.saveAvatar}> Save </button>
                </div> */}
            </div>
        );
    }
}


export default AvatarCreator;