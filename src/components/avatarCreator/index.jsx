import React, { Component } from 'react'
import styles from './avatarCreator.module.scss'

export default class AvatarCreator extends Component {

    parse(event){
        try{
            return JSON.parse(event.data);
        }
        catch(error){
            console.log(error);
        }
    }
    
    subscribe(event){
    
        const json = this.parse(event);
    
        if (json?.source !== 'readyplayerme') {
            return;
        }
    
        // Susbribe to all events sent from Ready Player Me once frame is ready
        if (json.eventName === 'v1.frame.ready') {
            frame.contentWindow.postMessage(
            JSON.stringify({
                target: 'readyplayerme',
                type: 'subscribe',
                eventName: 'v1.**'
            }),
            '*'
            );
        }
    
        // Get avatar GLB URL
        if (json.eventName === 'v1.avatar.exported') {
            // let loader = new GLTFLoader();
            // loader.crossOrigin = true;
            // let animations = {};
    
            // loader.load(mainChar, function (data) {
            //     animations = data.animations;
            // });
    
            // loader.load(json.data.url, function (data) {
            //     const model = data.scene;
            //     model.traverse(function (object) {
            //         if (object.isMesh) object.castShadow = true;
            //     });
    
            //     model.position.x = 0;
            //     model.position.z = 0;
    
            //     let objPos = {x:model.position.x, y:1, z:model.position.z};
            //     model.boundingObj = createBoundingObj(objPos);
            //     window.scene.add(model);
            //     window.scene.add(model.boundingObj);
    
            //     const charAnimations = animations;
            //     const mixer = new THREE.AnimationMixer(model);
            //     const animationsMap = new Map();
            //     charAnimations.filter(a => a.name != 'TPose').forEach((a) => {
            //         animationsMap.set(a.name, mixer.clipAction(a));
            //     })
            //     characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Idle');
            // });
            document.getElementById('frame').hidden = true;
        }
    
        // Get user id
        if (json.eventName === 'v1.user.set') {
            console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
        }
    }

    componentDidMount(){
        //Ready Player Me
		const frame = document.getElementById('frame');
		frame.src = ' https://obsessvr.readyplayer.me/avatar?frameApi';
		document.getElementById('frame').hidden = false;
		window.addEventListener('message', this.subscribe);
		document.addEventListener('message', this.subscribe);
    }
    render() {
        return (
            <div>
                <iframe id="frame" className={styles['frame']} allow="camera *; microphone *"></iframe>
            </div>
        )
    }
}
