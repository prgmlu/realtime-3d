import * as THREE from 'three'
export default class CollisionDetection {
    constructor(collisionObjects){
        this.collisionDetected = false;
        this.collisionObjects = collisionObjects;
    }

    setCollisionObjects = (collisionObjects) => {
        this.collisionObjects = collisionObjects;
        window.collisionObjects = this.collisionObjects;
    }

    getCollisionObjects = () => {
        return this.collisionObjects;
    }

    detectCollision = (boundingGeometry, objMatrix, objPosition) => {
        for (let vertexIndex=0; vertexIndex < boundingGeometry.vertices.length; vertexIndex++){
            var localVertex = boundingGeometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(objMatrix);
            var directionVector = globalVertex.sub(objPosition);

            var ray = new THREE.Raycaster( objPosition, directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects(this.collisionObjects);
            var collision = false;
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
                for(var i=0; i<collisionResults.length; i++){
                    // if(collisionResults[i].object.name.includes('Floor') || collisionResults[i].object.name.includes('Glass')) {
                        // continue;
                    // }
                    // else{
                        collision = true;
                    // }
                }
            }
            return collision;
        }
    }
}
