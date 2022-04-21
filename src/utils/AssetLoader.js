import * as THREE from 'three';
import { ThreeCacheManager } from '../wsm/ThreeCacheManager';

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

export function loadImageAsync(imageUrl, onImageLoaded, progressEventHandler = null, errorHandler = null, roomId=null) {
    const cachedImage = ThreeCacheManager.get(imageUrl);
    if (cachedImage) {
        if (onImageLoaded) {
            onImageLoaded(cachedImage);
        }
    } else {
        let textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageUrl, (image) => {
                if (onImageLoaded) {
                    onImageLoaded(image);
                }
                ThreeCacheManager.add(imageUrl, image, roomId);
            },
            (progressEvent) => {
                if (progressEventHandler) {
                    progressEventHandler(progressEvent);
                }
            },
            (error) => {
                if (errorHandler) {
                    errorHandler(error);
                }
            });
    }
}

export function loadUIImageAsync(imageUrl) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = () => {
            resolve(image);
        }
        image.onerror = () => {
            reject(new Error('Failed to load image at src ' + imageUrl));
        }
        image.src = imageUrl;
    });
}
