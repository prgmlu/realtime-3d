import React, { Component } from 'react';
import * as THREE from 'three'
import Slider from "slick-carousel";
import Lights from './Lights';
import {createScene, createRenderer} from './threeHelpers'
import CartButton from './ui/buttons/CartButton';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './SceneModal.css'


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
        // this.scene.background = new THREE.Color( 'white' );
        this.renderer = createRenderer();
        this.renderer.setSize((window.innerWidth*.35), (window.innerWidth*.35));
		this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
        this.myRef = React.createRef();
        this.lastMPos = {x: 0, y: 0};
        this.canRotate = false;
        this.item = props?.item;
        this.carouselItems = props?.carousel;
        this.closeModal = props?.closeModal;
        this.addToCart = props?.addToCart;
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
		if (this.camera.fov < 1) this.camera.fov = 1;
		if (this.camera.fov > 40) this.camera.fov = 40;
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

        this.item.position.set(0, -0.03, -1.5);
        
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
            <div id='blur'>
                <div id='modal'>

                            <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                this.unSetItem();
                                this.closeModal();
                            }}
                            style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                zIndex: 2,
                                right: '-15px',
                                top: '-15px',
                            }}
                        >
                            <img
                                src="https://cdn.obsess-vr.com/Close-button.png"
                                style={{
                                    maxWidth: '100%',
                                    width: '2.8em',
                                    float: 'right',
                                }}
                            ></img>
                        </div>

                            <div id='scene' ref={this.myRef}></div>

                            <div className="tag">
                                <h1>Image Gallery</h1>
                            </div>

                            <div className="imgslider">
                                <Slider {...{infinite:true,dots:true,slidesToShow:1,slidesToScroll:1,}}>
                                    {this.carouselItems.map((item, index) => (
                                        <div key={index}>
                                            <img src={item}/>
                                        </div>
                                    ))}
                                </Slider>
                            </div>

                        <CartButton itemId={this.item.itemId} addToCart={this.addToCart}/>
                        
                </div>
            </div>
        );
    }
}


export default SceneModal;