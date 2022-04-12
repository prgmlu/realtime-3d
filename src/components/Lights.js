import * as THREE from 'three'

export default class Lights {

    constructor(scene, renderer){
        this.scene = scene;
        this.renderer = renderer;

    }

    setUpNormalLights = () => {
        const light = new THREE.SpotLight(0xffffff, 0.8);
		light.angle = Math.PI / 3;
		light.position.set(0, 10, 0);
		this.scene.add(light);
		this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    }

    setUpEnvMapLights = () => {
        //TODO
    }
}