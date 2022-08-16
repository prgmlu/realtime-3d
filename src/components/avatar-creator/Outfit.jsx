import React, { useState } from 'react';
import * as THREE from 'three';
import { svgCircle } from './utils';
import './Outfit.css';

const importImgsFolder = (r) => {
    let images = [];
    r.keys().map((item) => {
        images.push({type: item.split('./')[1].split('_')[0], name: item.split('./')[1].split('.')[0], src: r(item).default})
    });
    return images;
}

const Outfit = (props) => {

    const [clothIndex, setClothIndex] = useState("Pants_blue")
    const currentScene = props?.currentScene;
    const textureLoader = new THREE.TextureLoader;
   
    const maleOutfits = {
        textures : importImgsFolder(require.context('../static/avatar/outfit/male/textures', false, /\.(png)$/)),
        display : importImgsFolder(require.context('../static/avatar/outfit/male/display', false, /\.(png)$/)),
    }

    const setOutfit = (e) => {
        let selectedItem = maleOutfits.textures.filter((texture) => {return texture.name == e.target.id})[0];
        let selectedTexture = textureLoader.load ( selectedItem.src );
        currentScene.children[0].children[0].getObjectByName( e.target.className ).material.map = selectedTexture;
        currentScene.children[0].children[0].getObjectByName( e.target.className ).material.needsUpdate = true;
        setClothIndex(e.target.id)
    }

    return (
        <div className='outfitEditor'>
            <div className='outFitText'>
                Outfit
            </div>
            <div className='outfitCloth'>
                {maleOutfits.display.map((outfit) => {
                    return <div key={outfit.name} className={clothIndex == outfit.name ?  'selectedOutfitEditorCard' : 'outfitEditorCard' }>
                                <img id={outfit.name} src={outfit.src} className={outfit.type} onClick={setOutfit}/>
                                {clothIndex == outfit.name &&
                                    <div className="selectedCircleCloth">
                                    {svgCircle}
                                </div>}
                            </div>
                })}
            </div>
        </div>
    )

}
export default Outfit;
