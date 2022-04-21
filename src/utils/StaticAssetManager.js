import { storeId } from '../../variables/Variables.js';

const variables = require('../../variables/Variables');
const apiUrl = variables.apiUrl;

export const brillianceWithin = "6063346304c9ac030236f65d";
export const holiday21 = "6116a51b9ed97ea76b08e204";
export const gifting = "61df82b57cc889e000268112";
export const engagementUrl = 'https://design.jared-diamonds.com/design-a-ring';

function getStaticUrlAsync(id) {
    const fetchUrl = apiUrl + 'asset/url?id=' + id;
    return new Promise((resolve, reject) => {
        fetch(fetchUrl)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Fetch static asset url failed with code ' + response.status);
                }
            })
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}

export const NavMarkerSpriteName = Object.freeze({
    NORMALLEFT: 'NavMarkerNormalLeft',
    NORMALRIGHT: 'NavMarkerNormalRight',
    NORMALUP: 'NavMarkerNormalUp',
    NORMALDOWN: 'NavMarkerNormalDown',
    NORMALUPLEFT: 'NavMarkerNormalUpLeft',
    NORMALDOWNLEFT: 'NavMarkerNormalDownLeft',
    NORMALUPRIGHT: 'NavMarkerNormalUpRight',
    NORMALDOWNRIGHT: 'NavMarkerNormalDownRight',
    NORMALSTAIRSUP: 'NavMarkerNormalStairsUp',
    NORMALSTAIRSDOWN: 'NavMarkerNormalStairsDown',
    HOVERLEFT: 'NavMarkerHoverLeft',
    HOVERRIGHT: 'NavMarkerHoverRight',
    HOVERUP: 'NavMarkerHoverUp',
    HOVERDOWN: 'NavMarkerHoverDown',
    HOVERUPLEFT: 'NavMarkerHoverUpLeft',
    HOVERDOWNLEFT: 'NavMarkerHoverDownLeft',
    HOVERUPRIGHT: 'NavMarkerHoverUpRight',
    HOVERDOWNRIGHT: 'NavMarkerHoverDownRight',
    HOVERSTAIRSUP: 'NavMarkerHoverStairsUp',
    HOVERSTAIRSDOWN: 'NavMarkerHoverStairsDown',
    FADELEFT: 'NavMarkerFadeLeft',
    FADERIGHT: 'NavMarkerFadeRight',
    FADEUP: 'NavMarkerFadeUp',
    FADEDOWN: 'NavMarkerFadeDown',
    FADEUPLEFT: 'NavMarkerFadeUpLeft',
    FADEDOWNLEFT: 'NavMarkerFadeDownLeft',
    FADEUPRIGHT: 'NavMarkerFadeUpRight',
    FADEDOWNRIGHT: 'NavMarkerFadeDownRight',
    FADESTAIRSUP: 'NavMarkerFadeStairsUp',
    FADESTAIRSDOWN: 'NavMarkerFadeStairsDown'
});

export function getHeartFillUrlAsync() {
    return getStaticUrlAsync('HeartFill');
}

export function getHeartEmptyUrlAsync() {
    return getStaticUrlAsync('HeartEmpty');
}

export function getNavMarkerUrlAsync(spriteName) {
    return getStaticUrlAsync(spriteName);
}

export function getProductMarkerNormalAsync() {
    return getStaticUrlAsync('ProductMarkerNormal');
}

export function getProductMarkerHoverAsync() {
    return getStaticUrlAsync('ProductMarkerHover');
}

export function getVideoMarkerNormalAsync() {
    return getStaticUrlAsync('VideoMarkerNormal');
}

export function getModalCloseIconNormalAsync() {
    return getStaticUrlAsync('ModalCloseIconNormal');
}

export function getModalCloseIconHoverAsync() {
    return getStaticUrlAsync('ModalCloseIconHover');
}

export function getDragToSpinAsync() {
    return getStaticUrlAsync('DragToSpin');
}

export function getDragToSpinIconAsync() {
    return getStaticUrlAsync('DragToSpinIcon');
}

export function getFacebookAsync() {
    return getStaticUrlAsync('FacebookIcon');
}

export function getTwitterAsync() {
    return getStaticUrlAsync('TwitterIcon');
}

export function getVideoPlayAsync() {
    return getStaticUrlAsync('VideoPlay');
}

export function getObsessLogoAsync() {
    return getStaticUrlAsync('ObsessLogo');
}

export function getObsessUrlAsync() {
    return getStaticUrlAsync('ObsessUrl');
}

export function getWelcomeExploreUrlAsync() {
    return getStaticUrlAsync('WelcomeExplore');
}

export function getZoomIconUrlAsync() {
    return getStaticUrlAsync('ZoomIcon');
}

const url = window.location.href;
export const shareSocialUrl = Object.freeze({
    facebook: (storeId === holiday21) ? 'https://www.facebook.com/sharer/sharer.php?u=' + url : 'https://www.facebook.com/JaredTheGalleriaOfJewelry',
    instagram: 'https://www.instagram.com/jaredthegalleriaofjewelry',
    youtube: 'https://www.youtube.com/c/thatsjared',
    twitter: (storeId === holiday21) ? 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('Visit a site : ') + '%20' + url : 'https://twitter.com/thatsjared',
    pinterest: (storeId === holiday21) ? 'http://pinterest.com/pin/create/button/?url=' + url + '&media=' + url : 'https://www.pinterest.com/thatsjared'
})