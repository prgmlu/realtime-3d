import React, { Component } from 'react';
import * as THREE from 'three'
import './AvatarCreatorEditor.css'

const maleModelImg = 'https://cdn.obsess-vr.com/maleModel%20.png';
const femaleModelImg = 'https://cdn.obsess-vr.com/femaleModel%20.png';

function importImgsFolder(r) {
    let images = [];
    r.keys().map((item) => {        
        images.push({type: item.split('./')[1].split('_')[0], src: r(item).default,})
    });
    return images;
}


class AvatarCreatorEditor extends Component {
    constructor(props) {
        super(props);
        this.textureLoader = new THREE.TextureLoader;
        this.maleOutfits = importImgsFolder(require.context('./static/avatar/outfit/male', false, /\.(png)$/));
        this.currentScene = props?.currentScene;
        this.currentAvatar = {};
    }
    state = {
        activeTab : 1,
        bodyType : 'male',
    }

    onTabClick = (e) => {
        this.setState({activeTab: e.target.id});
    }

    setBodyType = (e) => {
        this.setState({bodyType: e.target.id});
    }
    setOutfit = (e) => {
        let selectedTexture = this.textureLoader.load ( e.target.src );
        this.currentScene.children[0].children[0].getObjectByName( e.target.className ).material.map = selectedTexture;
        this.currentScene.children[0].children[0].getObjectByName( e.target.className ).material.needsUpdate = true
    }

    // componentDidMount() {  

    // }

    render() {
        return (
            <div className='avatarCreatorEditor'>

                <div className="settings">
                    <div id='1' className={this.state.activeTab==1? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='1'>Body type</p>
                    </div>
                    <div id='2' className={this.state.activeTab==2? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='2'>Skin tone</p>
                    </div>
                    <div id='3' className={this.state.activeTab==3? 'activeTab' : 'inactiveTab'} onClick={this.onTabClick}>
                        <p id='3'>Outfit</p>
                    </div>
                </div>

                <div className="content">
                    {this.state.activeTab==1&&<div className='bodyTypeEditor'>
                        <img
                            src={maleModelImg}
                            id='male'
                            className={this.state.bodyType=='male' ? 'selectedImg' : 'notSelectedImg'}
                            onClick={this.setBodyType}
                        />
                        <img
                            src={femaleModelImg}
                            id='female'
                            className={this.state.bodyType=='female' ? 'selectedImg' : 'notSelectedImg'}
                            onClick={this.setBodyType}
                        />
                    </div>}

                    {this.state.activeTab==2&&<div className='skinToneEditor'>
                    skinToneEditor
                    </div>}

                    {this.state.activeTab==3&&<div className='outfitEditor'>
                        {this.maleOutfits.map((outfit, index) => {
                            return <img id={index} src={outfit.src} class={outfit.type} onClick={this.setOutfit}/>
                        })}
                    </div>}
                </div>
                                 
            </div>
        );
    }
}


export default AvatarCreatorEditor;