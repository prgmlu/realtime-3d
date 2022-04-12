import { Component } from 'react'
import * as THREE from 'three'
import { Geometry } from 'three/examples/jsm/deprecated/Geometry'


// CONSTANTS
const fadeDuration = 0.2;
const walkVelocity = 2;
const DIRECTIONS = ['w', 'a', 's', 'd'];

export default class CharacterControls extends Component {

    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction = 'Idle'){

        super()
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;
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

    update(delta, keysPressed){

        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true);

        let play = '';

        if (directionPressed) {
            play = 'Walk'
        }
        else {
            play = 'Idle'
        }

        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play);
            const current = this.animationsMap.get(this.currentAction);

            current.fadeOut(fadeDuration);
            toPlay.reset().fadeIn(fadeDuration).play();

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
            const moveX = this.walkDirection.x * walkVelocity * delta
            const moveZ = this.walkDirection.z * walkVelocity * delta

            this.model.position.x += moveX
            this.model.position.z += moveZ
            this.model.boundingObj.position.x += moveX
            this.model.boundingObj.position.z += moveZ

            let collisionDetected = false;
            let boundingGeometry = new Geometry().fromBufferGeometry(this.model.boundingObj.geometry);

            for (let vertexIndex=0; vertexIndex < boundingGeometry.vertices.length; vertexIndex++){
                var localVertex = boundingGeometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4(this.model.boundingObj.matrix);
                var directionVector = globalVertex.sub(this.model.boundingObj.position);

                var ray = new THREE.Raycaster( this.model.boundingObj.position, directionVector.clone().normalize() );
                var collisionResults = ray.intersectObjects(window.sceneObjects);
                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
                    collisionDetected = true;
                    break;
                }
                else{
                    collisionDetected = false;
                }
            }
            if(collisionDetected){
                this.model.position.x -= (8*moveX);
                this.model.position.z -= (8*moveZ);
                this.model.boundingObj.position.x -= (8*moveX);
                this.model.boundingObj.position.z -= (8*moveZ);
                this.updateCameraTarget((-8)*moveX, (-8)*moveZ);
            }
            else{
                this.updateCameraTarget(moveX, moveZ);
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
            console.log(window.sceneObjects)
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