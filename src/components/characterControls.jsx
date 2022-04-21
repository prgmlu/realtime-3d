import * as THREE from 'three'
import { Geometry } from 'three/examples/jsm/deprecated/Geometry'


// CONSTANTS
const FADE_DURATION = 0.2;
const WALK_VELOCITY = 4;
const DIRECTIONS = ['w', 'a', 's', 'd'];

export default class CharacterControls {

    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction = 'Idle' , collisionDetection){
        this.model = model;
        this.boundingGeometry = new Geometry().fromBufferGeometry(this.model.boundingObj.geometry);
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;
        this.collisionDetection = collisionDetection;
        this.animationsMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play();
            }
        })
        this.orbitControl = orbitControl;
        this.camera = camera;
        this.walkDirection = new THREE.Vector3();
        this.rotateAngle = new THREE.Vector3(0, 1, 0);
        this.rotateQuarternion = new THREE.Quaternion();
        this.cameraTarget = new THREE.Vector3();
        this.lastCharPos = {x:0, z:0};
        this.updateCameraTarget(0,0);

        // state
        this.toggleRun = false;
        this.currentAction = currentAction;
    }

    setLastSafePlace = () => {
        this.lastSafePlace = this.model.position.clone();
    }

    goToLastSafePlace = () => {
        this.model.position.copy(this.lastSafePlace.clone());
        var collisionHappened = this.collisionDetection.detectCollision(this.boundingGeometry, this.model.boundingObj.matrix, this.model.boundingObj.position);
    }

    update = (delta, keysPressed) => {

        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true);
        let play = directionPressed? 'Walk' : 'Idle';


        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play);
            const current = this.animationsMap.get(this.currentAction);

            current.fadeOut(FADE_DURATION);
            toPlay.reset().fadeIn(FADE_DURATION).play();

            this.currentAction = play;
        }

        this.mixer.update(delta)

        if (this.currentAction == 'Walk') {
            // calculate towards camera direction
            var angleYCameraDirection = Math.PI + Math.atan2(
                    (this.camera.position.x - this.model.position.x), 
                    (this.camera.position.z - this.model.position.z))
            // diagonal movement angle offset
            var directionOffset = this.directionOffset(keysPressed)

            // rotate model
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.1)

            // calculate direction
            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // move model & camera
            const moveX = this.walkDirection.x * WALK_VELOCITY * delta
            const moveZ = this.walkDirection.z * WALK_VELOCITY * delta

            this.model.position.x += moveX
            this.model.position.z += moveZ
            this.model.boundingObj.position.x += moveX
            this.model.boundingObj.position.z += moveZ

            var collisionHappened = this.collisionDetection.detectCollision(this.boundingGeometry, this.model.boundingObj.matrix, this.model.boundingObj.position);
            // var collisionHappened = false;
            if(collisionHappened){
                this.model.position.x -= moveX
                this.model.position.z -= moveZ
                this.model.boundingObj.position.x -= moveX
                this.model.boundingObj.position.z -= moveZ
                this.goToLastSafePlace();
                return;
            }
            else{
                this.updateCameraTarget(moveX, moveZ);
                this.setLastSafePlace();
            }

            for(let i=0; i<window.interactObjects.length; i++){
                let distFromChar = window.interactObjects[i].position.distanceTo(this.model.position);
                if(distFromChar < 1.6){
                    // console.log(distFromChar)
                    // console.log(window.interactObjects[i].material)
                }
            }
        }

        else if (this.currentAction == 'Interacting'){
            var camDistance = this.camera.position.length();
            // var targetPos = new THREE.Vector3(point.x,point.y,point.z);
            // targetPos.normalize().multiplyScalar(-camDistance);
        }
    }

    updateCameraTarget(moveX, moveZ){
        // move camera
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        // update camera target
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget
    }

    directionOffset(keysPressed){
        var directionOffset = 0 // w

        if (keysPressed['w']) {
            if (keysPressed['a']) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed['d']) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed['s']) {
            if (keysPressed['a']) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed['d']) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed['a']) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed['d']) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }
}