import React, { Component } from 'react';
import Lights from './Lights';
import {createScene, createRenderer} from './threeHelpers'
import * as THREE from 'three'
import CartButton from './ui/buttons/CartButton';


const ITEM_POS = [0,0,-1.5];

const createCube = function (color=0x00ff00) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    cube.scale.set(.5, .5, .5);
    cube.position.set(0, 0, -5)
    return cube
}

class SceneModal extends Component {
    constructor(props) {
        super(props);
        this.scene = createScene();
        this.scene.background = new THREE.Color( 'white' );
        this.renderer = createRenderer();
        this.renderer.setSize((window.innerWidth*.35), (window.innerHeight*.9));
		this.camera = new THREE.PerspectiveCamera(50, (window.innerWidth*.35) / (window.innerHeight*.9), 0.1, 1000);
        this.myRef = React.createRef();
        this.lastMPos = {x: 0, y: 0};
        this.canRotate = false;
        this.item = props?.item;
        this.closeModal = props?.closeModal;
    }

    rotateObject = (e) => {
            if (!this.canRotate) return;
            //you can only calculate the distance if therer already was a mouse event
            if (e.touches && e.touches.length == 1) {
                if (typeof this.lastMPos.x != 'undefined') {
                    //calculate how far the mouse has moved
                    var deltaX = this.lastMPos.x - e.touches[0].clientX;
                    var deltaY = this.lastMPos.y - e.touches[0].clientY;
    
                    if (this.first) {
                        deltaX = 0;
                        deltaY = 0;
                    }
                    this.first = false;
    
                    //rotate your object accordingly
                    this.item.rotation.x -= deltaY * 0.03;
                    this.item.rotation.y -= deltaX * 0.03;
                }
    
                //save current mouse Position for next time
                this.lastMPos = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                };
            } else {
                if (typeof this.lastMPos.x != 'undefined') {
                    //calculate how far the mouse has moved
                    var deltaX = this.lastMPos.x - e.clientX,
                        deltaY = this.lastMPos.y - e.clientY;
    
                    if (this.first) {
                        deltaX = 0;
                        deltaY = 0;
                    }
                    this.first = false;
    
                    //rotate your object accordingly
                    this.item.rotation.x -= deltaY * 0.01;
                    this.item.rotation.y -= deltaX * 0.01;
                }
    
                //save current mouse Position for next time
                this.lastMPos = {
                    x: e.clientX,
                    y: e.clientY,
                };
            }
    
    }

	setZoom = (fov) => {
		this.camera.fov = fov;
		if (this.camera.fov < 10) this.camera.fov = 10;
		if (this.camera.fov > 50) this.camera.fov = 50;
		this.camera.updateProjectionMatrix();
	}

    mouseWheelHandler = (e) => {
		const fovDelta = e.deltaY;
		const temp = this.camera.fov + Math.round(fovDelta * 0.04);
		this.setZoom(temp);
	};


    handleRendererMouseMove = (e) => {
		this.rotateObject(e);
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

        this.setItem(this.item);

        this.myRef.current.appendChild(this.renderer.domElement);
        
        this.cube = createCube();
        
        this.animate();

    }

    memoOriginalPosition = (item) => {
        this.originalPosition = item.position.clone();
    }

    memoOriginalRotation = (item) => {
        this.originalRotation = item.rotation.clone();
    }

    setItemPosition = () => {
        this.item.position.set(...ITEM_POS);
    }

    setItemRotation = () => {
        this.item.rotation.set(0,0,0,'XYZ');
    }

    setItem = (item) => {
        this.memoOriginalPosition(item);
        this.memoOriginalRotation(item);
        this.setItemPosition();
        this.setItemRotation();
        this.scene.add(item);
    }

    unSetItem = () => {
        this.scene.remove(this.item);
        this.item.position.copy(this.originalPosition);
        this.item.rotation.copy(this.originalRotation);
        window.mainScene.add(this.item)
    }

    removeItem = () => {
        this.scene.remove(this.item);
        this.item = null;
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        return (
            <div
            id='blur'
            style={{
                width: '100%',
                height: '100%',
                backdropFilter: `blur(10px)`,
                WebkitBackdropFilter: `blur(10px)`,
                top:'0px',
                left:'0px',
                position: 'absolute',
            }}>
                <div
                id='modal'
                style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    position: 'absolute',
                }}
                ref={this.myRef} >

                            <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                this.unSetItem();
                                this.closeModal();
                            }}
                            style={{
                                position: 'absolute',
                                background: '#340c0c',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                margin: 25 + 'px',
                                zIndex: 2,
                                right: '0',
                                top: '0',
                            }}
                        >
                            <img
                                src="https://cdn.obsess-vr.com/modal-close-icon-normal.png"
                                style={{
                                    maxWidth: '100%',
                                    width: '2.8em',
                                    float: 'right',
                                }}
                            ></img>
                        </div>

                        <CartButton itemId={this.item.itemId}/>
                        
                </div>
            </div>
        );
    }
}


export default SceneModal;