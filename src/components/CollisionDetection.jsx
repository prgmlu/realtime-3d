import * as THREE from 'three'
export default class CollisionDetection {
    constructor(){
        this.collisionDetected = false;
    }

    detectCollision = (boundingGeometry, objMatrix, objPosition) => {
        for (let vertexIndex=0; vertexIndex < boundingGeometry.vertices.length; vertexIndex++){
            var localVertex = boundingGeometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(objMatrix);
            var directionVector = globalVertex.sub(objPosition);

            var ray = new THREE.Raycaster( objPosition, directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects(window.sceneObjects);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
                this.collisionDetected = true;
                break;
            }
            else{
                this.collisionDetected = false;
            }
        }
    }
}
