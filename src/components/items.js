import * as THREE from 'three'
import oldRoomObject from './static/glb_files/walls.glb'
// import newRoomObject from './static/glb_files/Armani_GlowRoomV00011.glb'
import shoes from './static/glb_files/shoes.glb'
import shoesImg from './static/glb_imgs/shoes.png'
import shoes2 from './static/glb_files/shoes_2.glb'
import shoes2Img from './static/glb_imgs/shoes_2.png'
import smallBag from './static/glb_files/small_bag.glb'
import smallBagImg from './static/glb_imgs/small_bag.png'
import smallBag2 from './static/glb_files/small_bag_2.glb'
import smallBag2Img from './static/glb_imgs/small_bag_2.png'
import bag from './static/glb_files/bag.glb'
import bagImg from './static/glb_imgs/bag.png'
import arrowImg from './static/arrow.png'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


window.interactObjects = [];
window.cursorChangingObjects = [];

export class ItemCollection {
    constructor(scene, loader, camera, renderer,USE_NEW_STORE_WALLS){
        this.roomObject = USE_NEW_STORE_WALLS? newRoomObject: oldRoomObject;
        this.scene = scene;

        window.addEventListener('mousemove', (e)=>{
            var hit = getRaycastIntersects(e,this.camera);
            if (hit && hit.length > 0) {
                this.renderer.domElement.style.cursor = 'pointer';
            } else {
                this.renderer.domElement.style.cursor = 'default';
            }
    
        })

        this.items = [
            {
                id:0,
                type: '3D',
                url:this.roomObject,
                position : {
                    x:0,
                    y:0,
                    z:USE_NEW_STORE_WALLS?2:0,
                },
                rotation: [
                    0,
                    0,
                    0,
                ],
            },
            {
                id:1,
                type: '3D',
                url:shoes,
                name: 'Black Shoes',
                price: '99.99$',
                img:shoesImg,
                interact: true,
                indicator : {},
                position: {
                    x:USE_NEW_STORE_WALLS?2:-4.2,
                    y:1.25,
                    z:USE_NEW_STORE_WALLS?-3:0,
                },
                rotation : [
                    0,
                    USE_NEW_STORE_WALLS?0:Math.PI/2,
                    0,
                ],
            },
            {
                id:2,
                type: '3D',
                url:shoes2,
                name: 'Sports Shoes',
                price: '79.99$',
                img:shoes2Img,
                interact: true,
                indicator : {},
                position: {
                    x:USE_NEW_STORE_WALLS?1:3.8,
                    y:1.25,
                    z:USE_NEW_STORE_WALLS?-3:.7,
                },
                rotation : [
                    0,
                    USE_NEW_STORE_WALLS?0:-Math.PI/2.5,
                    0,
                ],
            },
            {
                id:3,
                type: '3D',
                url:bag,
                name: 'Red Backpack',
                price: '14.99$',
                img:bagImg,
                interact: true,
                indicator : {},
                position: {
                    x:USE_NEW_STORE_WALLS?0:3.6,
                    y:1.2,
                    z:USE_NEW_STORE_WALLS?-3:1.7,
                },
                rotation : [
                    0,
                    USE_NEW_STORE_WALLS?(Math.PI/2):0,
                    0,
                ],
            },
            {
                id:4,
                type: '3D',
                url:smallBag,
                name: 'Red Hand Bag',
                price: '49.99$',
                img:smallBagImg,
                interact: true,
                indicator : {},
                position: {
                    x:USE_NEW_STORE_WALLS?-2:-4.2,
                    y:1.25,
                    z:USE_NEW_STORE_WALLS?-3:.9,
                },
                rotation : [
                    0,
                    USE_NEW_STORE_WALLS?(Math.PI):Math.PI/2,
                    0,
                ],
            },
            {
                id:5,
                type: '3D',
                url:smallBag2,
                name: 'Black Hand Bag',
                price: '49.99$',
                img:smallBag2Img,
                interact: true,
                indicator : {},
                position: {
                    x:USE_NEW_STORE_WALLS?-1:-4.2,
                    y:1.25,
                    z:USE_NEW_STORE_WALLS?-3:-.9,
                },
                rotation : [
                    0,
                    USE_NEW_STORE_WALLS?0:Math.PI/2,
                    0,
                ],
            },
            {
                id:6,
                type: '2D',
                url:smallBag2Img,
                name: 'Black Hand Bag',
                price: '49.99$',
                interact: true,
                indicator : {},
                position: {
                    x:USE_NEW_STORE_WALLS?-1:-4.8,
                    y:1.65,
                    z:USE_NEW_STORE_WALLS?-3:-4,
                },
            }
        ]
        
        this.loader = loader;
        this.camera = camera;
        this.renderer = renderer;

        // this.items = items;
        this.sceneItems = this.items.slice();


        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
            'https://www.gstatic.com/draco/v1/decoders/',
        );
        this.loader.setDRACOLoader(dracoLoader);

        //this will be used for collision detection, and for raycasting and interaction
        this.allObjectsParts = [];
        window.allObjectsParts = this.allObjectsParts;
    }

    getAllObjectsParts = () => {
        return this.allObjectsParts;
    }

    getItemById = (id) => {
        return this.sceneItems[id];
    }

    createIndicator = (pos) => {
        const map = new THREE.TextureLoader().load(arrowImg);
        const material = new THREE.SpriteMaterial( { map: map } );
        const sprite = new THREE.Sprite( material );
        sprite.visible = false
        sprite.position.set(pos.x, pos.y, pos.z);
        sprite.scale.set(0.15, 0.15, 1);
        this.scene.add(sprite);
        return sprite
    }

    easeOutBounce = (x) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    }

    putItems = () => {
	this.items.map((item, indx)=>{
		//the item fields are url, position, rotation
        if(item.type === '3D'){
            this.loader.load(item.url,(data) => {
                data.scene.itemId = item.id;
                data.scene.position.copy(item.position)
                data.scene.rotation.fromArray(item.rotation)
                data.scene.traverse((i)=>{
                    i.material && (i.material.envMapIntensity = 1.81);
                    if(i.name.includes('Floor') || i.name.includes('Glass')) {
                        return
                    }
                        ;
                    this.allObjectsParts.push(i);
                    i.userData.id = item.id;
                    //assuming the first item is the store walls
                    if(indx!=0){
                        cursorChangingObjects.push(i);
                    }
                })
                this.items[indx].indicator = this.createIndicator({x:item.position.x, y:item.position.y + 0.75, z:item.position.z});
                this.scene.add(data.scene);
                this.sceneItems[item.id] = data.scene;
            })
        }
        else if (item.type === '2D'){
            let map = new THREE.TextureLoader().load(item.url);
            let material = new THREE.SpriteMaterial( { map: map } );
            let sprite = new THREE.Sprite( material );
            sprite.position.copy(item.position)
            this.items[indx].indicator = this.createIndicator({x:item.position.x, y:item.position.y + 0.75, z:item.position.z});
            sprite.userData.id = item.id;
            this.scene.add(sprite);
            this.sceneItems[item.id] = sprite;
            cursorChangingObjects.push(sprite);
        }
	})
    }
}



let raycaster = new THREE.Raycaster();
export const getRaycastIntersects = (e,camera) =>{
    if (e.touches) {
        // var x = this.lastEvent?.touches[0].pageX;
        // var y = this.lastEvent?.touches[0].pageY;
        var x = this.lastEvent?.touches[0].pageX;
        var y = this.lastEvent?.touches[0].pageY;
    } else {
        var x = e.clientX;
        var y = e.clientY;
    }
    raycaster.setFromCamera(
        {
            x: (x / window.innerWidth) * 2 - 1,
            y: -(y / window.innerHeight) * 2 + 1,
        },
        camera,
    );
    if (window?.cursorChangingObjects) {
        return raycaster.intersectObjects(
            window.cursorChangingObjects.concat([]),
        );
    }
    return [];
}




