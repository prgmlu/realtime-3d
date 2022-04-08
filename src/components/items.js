import * as THREE from 'three'
import roomObject from './static/glb_files/walls.glb'
import shoes from './static/glb_files/shoes.glb'
import shoes2 from './static/glb_files/shoes_2.glb'
import smallBag from './static/glb_files/small_bag.glb'
import smallBag2 from './static/glb_files/small_bag_2.glb'
import bag from './static/glb_files/bag.glb'


const createInteractionSphere = (position) => {
    const objGeometry = new THREE.SphereGeometry( .1);
    const objMaterial = new THREE.MeshBasicMaterial({color:'red', transparent:true, opacity:0});
    const boundingObj = new THREE.Mesh(objGeometry, objMaterial);
	boundingObj.position.set(position.x, position.y, position.z);
    return boundingObj
}

window.sceneObjects = [];
window.interactObjects = [];


export const putItems = function(scene, loader, items){
    
	items.map((item)=>{
		//the item fields are url, position, rotation
		loader.load(item.url,function(data){
			data.scene.position.x = item.position.x;
			data.scene.position.y = item.position.y;
			data.scene.position.z = item.position.z;
			
			data.scene.rotation.x = item.rotation.x;
			data.scene.rotation.y = item.rotation.y;
			data.scene.rotation.z = item.rotation.z;
            
            for(let i=0; i<data.scene.children.length; i++){
                if(data.scene.children[i].children.length>0){
                    for(let j=0; j<data.scene.children[i].children.length; j++){
                        window.sceneObjects.push(data.scene.children[i].children[j]);
                    }
                }
                else{
                    window.sceneObjects.push(data.scene.children[i]);
                }
            }
            let interactionObj = createInteractionSphere({x:item.position.x, y:item.position.y, z:item.position.z})
            window.interactObjects.push(interactionObj);
			scene.add(data.scene);
            scene.add(interactionObj);
		})
	})

    // const testGeo = new THREE.BoxGeometry(1, 1, 1);
    // const testMat = new THREE.MeshBasicMaterial({color:'red', transparent:true, opacity:0});
    // const testObj = new THREE.Mesh(testGeo, testMat);
    // testObj.position.set(0, 2, 0);

    // const _obj = testObj;

    // const pointsArray = _obj.geometry.attributes.position.array;
    // const itemSize = _obj.geometry.attributes.position.itemSize;
    // let points = [];

    // for (let i = 0; i < pointsArray.length; i += itemSize ) {
    //     points.push( new THREE.Vector3( pointsArray[i], pointsArray[i+1], pointsArray[i+2]));
    // }

    // //Edge Lines
    // const edgeGeometry = new THREE.EdgesGeometry( _obj.geometry );
    // edgeGeometry.setAttribute('color', new THREE.Uint8BufferAttribute([
    // 	255, 255, 0,
    // 	255, 255, 0,
    // 	0, 255, 255,
    // 	0, 255, 255
    // ], 3, true));
    // edgeGeometry.computeBoundingSphere();

    // const lines = new THREE.LineSegments(edgeGeometry,
    //     new THREE.LineBasicMaterial({
    //         color: '#3370FE',
    //         linewidth: 10,
    //         // transparent: true,
    //         // opacity: 0.8,
    //         // vertexColors: THREE.VertexColors,
    //         // side: THREE.DoubleSide,
    //     })
    // );
    // lines.position.set(0, 2, 0);
    // scene.add(lines)

    // //Edge Squares
    // const edgeSquares = new THREE.Points(
    //     new THREE.BufferGeometry().setFromPoints(points),
    //     new THREE.PointsMaterial({ color:'#3370FE', size:0.02 })
    // );
    // edgeSquares.position.set(0, 2, 0);
    // scene.add(edgeSquares)
}

export const items = [
    {
        url:roomObject,
        position : {
            x:0,
            y:0,
            z:0,
        },
        rotation: {
            x:0,
            y:0,
            z:0,
        }
    },
    {
        url:shoes,
        position: {
            x:-4.2,
            y:1.25,
            z:0,
        },
        rotation : {
            x:0,
            y:Math.PI/2,
            z:0,
        },
    },
    {
        url:shoes2,
        position: {
            x:3.8,
            y:1.25,
            z:.7,
        },
        rotation : {
            x:0,
            y:-Math.PI/2.5,
            z:0,
        },
    },
    {
        url:bag,
        position: {
            x:3.6,
            y:1.2,
            z:1.7,
        },
        rotation : {
            x:0,
            y:0,
            z:0,
        },
    },
    {
        url:smallBag,
        position: {
            x:-4.2,
            y:1.25,
            z:.9,
        },
        rotation : {
            x:0,
            y:Math.PI/2,
            z:0,
        },
    },
    {
        url:smallBag2,
        position: {
            x:-4.2,
            y:1.25,
            z:-.9,
        },
        rotation : {
            x:0,
            y:Math.PI/2,
            z:0,
        },
    }
]