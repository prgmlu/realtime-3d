
import React, { Component } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { PointerLockControls } from './PointerLockControls'
import wallImage from './static/wall.jpg'
import roomObject from './static/glb_files/walls.glb'
import shoes from './static/glb_files/shoes.glb'
import shoes2 from './static/glb_files/shoes_2.glb'
import smallBag from './static/glb_files/small_bag.glb'
import smallBag2 from './static/glb_files/small_bag_2.glb'
import bag from './static/glb_files/bag.glb'
import tShirt from './static/glb_files/moko2.glb'


var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const raycaster = new THREE.Raycaster( );
const mouse = new THREE.Vector2();
var objectIntersected = false;
const lastCamPos = new THREE.Vector3();

const createStore = () => {

  const textureLoader = new THREE.TextureLoader();

  const newStore = new THREE.Group();

  const wallGeometry = new THREE.PlaneGeometry(20, 5, 100, 100);
  const wallTexture = textureLoader.load( wallImage );
  const wallMaterial = new THREE.MeshStandardMaterial( { map: wallTexture, side: THREE.DoubleSide });
  wallTexture.anisotropy = 16;
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set( 1, 1 );
  wallTexture.encoding = THREE.sRGBEncoding;

  const firstWall = new THREE.Mesh( wallGeometry, wallMaterial );
  firstWall.position.z = -10;
  firstWall.position.y = 2.5;

  const secondWall = new THREE.Mesh( wallGeometry, wallMaterial );
  secondWall.position.z = 10;
  secondWall.position.y = 2.5;

  const thirdWall = new THREE.Mesh( wallGeometry, wallMaterial );
  thirdWall.rotation.y = Math.PI / 2;
  thirdWall.position.x = 10;
  thirdWall.position.y = 2.5;

  const fourthWall = new THREE.Mesh( wallGeometry, wallMaterial );
  fourthWall.rotation.y = Math.PI / 2;
  fourthWall.position.x = -10;
  fourthWall.position.y = 2.5;

  newStore.add(firstWall, secondWall, thirdWall, fourthWall);

  return newStore;
}

const onKeyDown = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;

  }
};

const onKeyUp = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;

  }
};

function onMouseMove( event ) {
	mouse.x = ( event.clientX / document.body.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / document.body.innerHeight ) * 2 + 1;
}
export default class Store extends Component {

  componentDidMount(){
    const cursor = document.createElement('div')
    cursor.style.width = '10px'
    cursor.style.height = '10px'
    cursor.style.background = 'red'
    cursor.style.position = 'absolute'
    cursor.style.top = '0'
    cursor.style.left = '0'
    cursor.style.right = '0'
    cursor.style.bottom = '0'
    cursor.style.margin = 'auto'
    cursor.style.zIndex= '99'
    document.body.appendChild(cursor)

    const scene = new THREE.Scene();
    const canvas = document.getElementById('webgl');
    const renderer = new THREE.WebGLRenderer({
        canvas : canvas,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const light = new THREE.SpotLight( 0xffffff, 0.8 );
    light.angle = Math.PI / 3;
    light.position.set(0, 10, 0);
    scene.add(light);

    scene.add( new THREE.AmbientLight( 0xffffff, 0.7 ));

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.y = 1.5;
    camera.position.z = 6;

    const controls = new PointerLockControls( camera, canvas );

    canvas.addEventListener( 'click', function () {controls.lock();} );
    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );

    const surroundings = createStore();
    scene.add(surroundings);

    scene.add( controls.getObject() );

    const loader = new GLTFLoader();
    loader.crossOrigin = true;
    loader.load( roomObject, function ( data ) {
      window.roomObject = data.scene;
      window.roomObject.position.set(0, 0, 0);
      scene.add( window.roomObject );
    });
    loader.load( shoes, function ( data ) {
      window.shoes = data.scene;
      window.shoes.position.set(-4.2, 1.25, 0);
      window.shoes.rotation.y = Math.PI/2
      scene.add( window.shoes );
    });
    loader.load( shoes2, function ( data ) {
      window.shoes2 = data.scene;
      window.shoes2.position.set(3.8, 1.25, 0.7);
      window.shoes2.rotation.y = -Math.PI/2.5
      scene.add( window.shoes2 );
    });
    loader.load( bag, function ( data ) {
      window.bag = data.scene;
      window.bag.position.set(3.6, 1.2, 1.7);
      scene.add( window.bag );
    });
    loader.load( smallBag, function ( data ) {
      window.smallBag = data.scene;
      window.smallBag.position.set(-4.2, 1.25, 0.9);
      window.smallBag.rotation.y = Math.PI/2
      scene.add( window.smallBag );
    });
    loader.load( smallBag2, function ( data ) {
      window.smallBag2 = data.scene;
      window.smallBag2.position.set(-4.2, 1.25, -0.9);
      window.smallBag2.rotation.y = Math.PI/2
      scene.add( window.smallBag2 );
    });

    function animate() {

      const time = performance.now();

      if ( controls.isLocked === true ) {

        // raycaster.ray.origin.copy( controls.getObject().position );

        raycaster.setFromCamera( mouse, camera );

        // // calculate objects intersecting the picking ray
        // const intersects = raycaster.intersectObjects( [sphere, window.tShirt] );

        // if ( intersects && intersects.length > 0) {
        //   objectIntersected = true;
        // }

        // else{
        //   objectIntersected = false;
        // }


        const delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward){
         
            velocity.z -= direction.z * 30.0 * delta;
            lastCamPos.copy(camera.position);
        }
        if (moveLeft || moveRight) {

          velocity.x -= direction.x * 30.0 * delta;
          lastCamPos.copy(camera.position);
        }    

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );

        if ( camera.position.x < -6.5 || camera.position.x > 6.5 || camera.position.z < -6.5 || camera.position.z > 6.5 ){

          camera.position.copy(lastCamPos);
        }

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 1.5 ) {

          velocity.y = 0;
          controls.getObject().position.y = 1.5;

        }
      }

      prevTime = time;

      renderer.render( scene, camera );

      requestAnimationFrame( animate );

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

// export default Store;