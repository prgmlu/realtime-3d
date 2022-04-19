import React, { Component } from 'react';
import Lights from './Lights';
import {createScene, createRenderer} from './threeHelpers'
import * as THREE from 'three'


const ITEM_POS = [0,0,-1.5];

const createCube = function (color=0x00ff00) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    // window.cube = cube;
    cube.scale.set(.5, .5, .5);
    // cube.position.x=-5.2;
    // cube.position.y=-5.2;
    cube.position.set(0, 0, -5)
    return cube
}

class SceneModal extends Component {
    constructor(props) {
        super(props);
        this.scene = createScene();
        this.renderer = createRenderer();
		this.camera = new THREE.PerspectiveCamera(
			70,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		);


        const Light = new Lights(this.scene, this.renderer);
		Light.setUpNormalLights();
        this.myRef = React.createRef();

        this.canRotate = false;

    }

    rotateObject = (e) => {
            if (!this.canRotate) return;
            //you can only calculate the distance if therer already was a mouse event
            if (e.touches && e.touches.length == 1) {
                if (typeof this.lastMPos.x != 'undefined') {
                    //calculate how far the mouse has moved
                    var deltaX = this.lastMPos.x - e.touches[0].clientX;
                    var deltaY = this.lastMPos.y - e.touches[0].clientY;
    
                    // var ex = deltaX/deltaY *.01;
                    // if (ex && ex!=Infinity && ex!=-Infinity){
                    //     this.item.rotation.z -=  ex;
                    // }
    
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
                    // var ex = deltaX/deltaY *.01;
                    // if (ex && ex!=Infinity && ex!=-Infinity){
                    //     this.item.rotation.z -=  ex;
                    // }
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
		if (this.camera.fov < 20) this.camera.fov = 20;
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

        this.renderer.domElement.addEventListener('mouseup',this.handleMouseUp, true);
        this.renderer.domElement.addEventListener('mousedown',this.handleMouseDown, true);

        this.lastMPos = {
			x: 0,
			y: 0,
		};

        window.setItem = this.setItem;

        // window.cube = createCube('red');





        this.myRef.current.appendChild(this.renderer.domElement);
        
        this.cube = createCube();
        // this.setItem(this.cube);

        this.animate();

    }

    componentWillUnmount() {

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
        // if(this.scene.children.includes(this.item)) this.scene.remove(this.item);
        // debugger;
        this.item = item;
        this.setItemPosition();
        this.setItemRotation();
        this.scene.add(item);
    }

    unSetItem = () => {
        this.scene.remove(this.item);
        this.item.position.copy(this.originalPosition);
        this.item.rotation.copy(this.originalRotation);
        // this.item.position = this.originalPosition;
        // this.item.rotation = this.originalRotation;
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
            id='modal'
            style={{
                backdropFilter: `blur(10px)`,
                visibility:'hidden',
                WebkitBackdropFilter: `blur(10px)`,
                top:'0px',
                left:'0px',
                position: 'absolute',
            }}
             ref={this.myRef} >

                        <div 
						onClick={(e) => {
							e.stopPropagation();
                            this.unSetItem();
                            document.querySelector('#modal').style.visibility='hidden';
						}}
						style={{
							position: 'absolute',
							background: '#340c0c',
							borderRadius: '50%',
							cursor: 'pointer',
							margin: 25 + 'px',
							zIndex: 2,
							left: '66%',
							top: '10%',
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


            </div>
        );
    }
}


export default SceneModal;