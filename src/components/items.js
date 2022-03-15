import roomObject from './static/glb_files/walls.glb'
import shoes from './static/glb_files/shoes.glb'
import shoes2 from './static/glb_files/shoes_2.glb'
import smallBag from './static/glb_files/small_bag.glb'
import smallBag2 from './static/glb_files/small_bag_2.glb'
import bag from './static/glb_files/bag.glb'

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

			scene.add(data.scene);
		})
	})
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