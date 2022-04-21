import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

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

    setUpEnvMapLights = (setBG=false) => {
            var rgbeLoader = new RGBELoader();
            rgbeLoader.load(
                'https://cdn.obsess-vr.com/charlotte-tilbury/Footprint_Court_Env_v002.hdr',
                (texture) => {
                    const generator = new THREE.PMREMGenerator(this.renderer);
                    generator.compileEquirectangularShader();
                    var envMap = generator.fromEquirectangular(texture).texture;
                    this.scene.environment = envMap;

                    if(setBG){

                        this.texLoader = new THREE.TextureLoader();
                        var tex = this.texLoader.load('https://cdn.obsess-vr.com/lululemon/fish.jpeg');
                        this.scene.background = tex;
                    }
                },
            );
        //TODO
    }
}