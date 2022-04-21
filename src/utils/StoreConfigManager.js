/*
    Provides basic config that determines which store is being pulled from. Also contains all that functions that
    ultimately fetch data from the webstore api – this file is the origin of all database data within this application
 */

import { constructUrl } from './UrlConstructor.js';
import { setStoreName } from './Analytics.js';
import { setGAHelperStoreName } from './GoogleAnalyticsHelper.js';
import { getHeartBeatGUID } from './IdGenerator.js';

const variables = require('../../variables/Variables.js');

/*
    Provides basic config that determines which store is being pulled from. Also contains all that functions that
    ultimately fetch data from the webstore api – this file is the origin of all database data within this application
 */

const internalGetStoreId = () => {
    // * IMPORTANT: need the quotation marks
    // if (process.env.BUILD_ENV === '"dev"') {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const urlParamsStoreId = urlParams.get('id');
    //     if (urlParamsStoreId) {
    //         return urlParamsStoreId.split('/')[0];  // remove trailing slash
    //     }
    // }
    return variables.storeId;
}

const data = {
    storeId: internalGetStoreId(),
    storeData: null,
    trackingParameter: null,
    sceneInfoDict: null,
    styleData: null
};

const apiUrl = variables.apiUrl;

let windowLocation = window.location.href.replace('http://', '');
windowLocation = windowLocation.replace('https://', '');
let storeDataFetchRoute = 'store?' + windowLocation;

const dummyGAId = 'UA-91780857-16';
const jaredGAUSAStagingID = '207131517';
const jaredGAIndiaStagingID = '207109364';

let userGUID = null;

function fetchInfoFromApiUrlWithIdAsync(completeRoute) {
    const fetchUrl = apiUrl + completeRoute;
    return new Promise((resolve, reject) => {
        fetch(fetchUrl)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Fetch info failed with code ' + response.status);
                }
            })
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}

function setFetchStoreDataRoute(route) {
    storeDataFetchRoute = route;
}

export function setFetchStoreDataRouteToClientAndStoreNameRoute(client, store) {
    const route = 'store-with-name?client=' + client + '&store=' + store;
    setFetchStoreDataRoute(route);
}

export function getStoreId() {
    return data.storeId;
}

export function getStoreDataAsync() {
    return new Promise((resolve, reject) => {
        if (data.storeData) {
            return resolve(data.storeData);
        }

        let storeId = data.storeId;
        if (storeId) {
            storeDataFetchRoute = 'store-with-id?id=';
        }

        fetchInfoFromApiUrlWithIdAsync(storeDataFetchRoute + storeId)
            .then(storeInfo => {
                if (!storeId) {
                    data.storeId = storeInfo['id'];
                }
                const storeName = storeInfo['name'];
                setStoreName(storeName);
                setGAHelperStoreName(storeName);

                data.storeData = storeInfo;
                const generalInfo = storeInfo.general;
                if (generalInfo['tracking_parameter_value'] != '') {
                    data.trackingParameter = generalInfo['tracking_parameter_name'] + '=' + generalInfo['tracking_parameter_value'];
                } else {
                    data.trackingParameter = generalInfo['tracking_parameter_name'].indexOf('&') === 0 ? generalInfo['tracking_parameter_name'].substring(1) : generalInfo['tracking_parameter_name'];
                }
                resolve(storeInfo);
            })
            .catch(error => reject(error));
    });
}

export function getSceneInfoAsync(sceneId) {
    return new Promise((resolve, reject) => {
        if (data.sceneInfoDict) {
            return resolve(data.sceneInfoDict[sceneId]);
        }
        fetchInfoFromApiUrlWithIdAsync('scene?id=' + sceneId)
            .then(sceneInfoString => {
                const sceneInfoObject = JSON.parse(sceneInfoString);
                resolve(sceneInfoObject);
            })
            .catch(error => reject(error));
    });
}

export function getAllSceneInfoDictAsync() {
    return new Promise((resolve, reject) => {
        if (data.sceneInfoDict) {
            return resolve(data.sceneInfoDict);
        }
        getStoreDataAsync()     // this sets the store id if store id isn't set yet
            .then(() => {
                const storeId = data.storeId;
                return fetchInfoFromApiUrlWithIdAsync('scene/all?id=' + storeId);
            })
            .then(allSceneInfos => {
                const infoDict = {};
                allSceneInfos.forEach(info => {
                    const id = info['id'];
                    info["updated_at"] = data.storeData.updated_at ? data.storeData.updated_at : null;
                    infoDict[id] = info;
                });
                data.sceneInfoDict = infoDict;
                resolve(infoDict);
            })
            .catch(error => reject(error));
    });
}

export function getSceneIds() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => resolve(storeInfo.scenes))
            .catch(error => reject(error));
    });
}

// Gets all RoomObject data for a scene. sku for Product Markers originates from here
export function getSceneRoomObjectsAsync(sceneId) {
    return new Promise((resolve, reject) => {
        const fetchUrl = apiUrl + 'scene/objects?id=';
        fetch(fetchUrl + sceneId)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Fetch scene objects failed with code ' + response.status);
                }
            })
            .then(responseJson => {
                if (responseJson) {
                    resolve(JSON.parse(responseJson));
                } else {
                    throw new Error('Can`t parse response ' + responseJson);
                }
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
    });
}

export function getClientNameAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const clientId = storeInfo['client'];
                const fetchUrl = apiUrl + 'client?id=' + clientId;
                return fetch(fetchUrl);
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Fetch client name failed with code ' + response.status);
                }
            })
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}

export function getLogoDataAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const logoData = {
                    imageSrc: storeInfo['logo'],
                    redirectUrl: storeInfo['logo_destination_url']
                };
                resolve(logoData);
            })
            .catch(error => reject(error));
    });
}

export function getSocialDataAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                resolve(storeInfo.general.social_media)
            })
            .catch(error => reject(error));
    });
}

export function getHotspotIconStyle() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const icon = storeInfo.styling['hotspot_icon'];
                resolve(icon);
            })
            .catch(error => reject(error));
    })
}

export function getStyleColorAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const colors = [storeInfo.styling['primary_color'], storeInfo.styling['secondary_color']];
                resolve(colors);
            })
            .catch(error => reject(error));
    });
}

export function getProductButtonColorsAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const { buy_now_primary_color, buy_now_secondary_color, buy_now_border_color, add_to_cart_primary_color,
                    add_to_cart_secondary_color, add_to_cart_border_color } = storeInfo.styling;

                resolve({
                    buyNowPrimaryColor: buy_now_primary_color,
                    buyNowSecondaryColor: buy_now_secondary_color,
                    buyNowBorderColor: buy_now_border_color,
                    addToCartPrimaryColor: add_to_cart_primary_color,
                    addToCartSecondaryColor: add_to_cart_secondary_color,
                    addToCartBorderColor: add_to_cart_border_color
                });
            })
            .catch(error => reject(error));
    })
}

export function getProductButtonFields() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const { button_border_radius, button_border_width, buy_now_border_active_on,
                    add_to_cart_border_active_on } = storeInfo.styling;

                resolve({
                    buttonBorderRadius: button_border_radius,
                    buttonBorderWidth: button_border_width,
                    buyNowBorderActiveOn: buy_now_border_active_on,
                    addToCartBorderActiveOn: add_to_cart_border_active_on
                });
            })
            .catch(error => reject(error));
    })
}

export function getIconsColorAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const color = storeInfo.styling['icons_color'];
                resolve(color);
            })
            .catch(error => reject(error));
    });
}

export function getBackgroundMusicUrlAndStartStatus() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const urlObject = storeInfo.styling['music'];
                if (!urlObject) {
                    return resolve({
                        url: null,
                        playOnStart: false
                    });
                }
                const url = constructUrl(urlObject);
                const playOnStart = storeInfo.styling['music_active'];
                const result = {
                    url: url,
                    playOnStart: playOnStart
                };
                if (url) {
                    return resolve(result);
                } else {
                    throw new Error('No background music found!');
                }
            })
            .catch(error => reject(error));
    });
}

export function getShowPoweredByObsessAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const showPoweredByObsess = storeInfo.general['powered_by_obsess'];
                resolve(showPoweredByObsess);
            })
            .catch(error => reject(error));
    });
}

export function getShowInitialAnimation() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const showInitialAnimation = storeInfo.general['initial_animation'];
                resolve(showInitialAnimation);
            })
            .catch(error => reject(error));
    });
}

export function getTipsSettingsAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const isInsideMenu = storeInfo.styling['inside_tips_menu'];
                resolve(isInsideMenu);
            })
            .catch(error => reject(error));
    });
}

export function getTipsIconAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const tipsIcon = storeInfo.styling['tips_icon'];
                resolve(tipsIcon);
            })
            .catch(error => reject(error));
    });
}

export function getHasDisclaimerAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const hasDisclaimer = storeInfo.general['disclaimer'];
                resolve(hasDisclaimer);
            })
            .catch(error => reject(error));
    });
}

export function getWelcomeMessageStyleAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const fontInfos = storeInfo.styling.fonts;
                const welcomeStyle = fontInfos['welcome_message'];
                let fontStyles = null;
                if (welcomeStyle) {
                    fontStyles = {
                        name: welcomeStyle.name,
                        size: welcomeStyle.size,
                        color: welcomeStyle.color,
                    };
                }
                resolve(fontStyles);
            })
            .catch(error => reject(error));
    });
}

export function getWelcomeTitleAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => resolve(storeInfo.general['welcome_message']))
            .catch(error => reject(error));
    });
}

export function getEntranceAutoTransitionAysnc() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const transitionSceneIndex = storeInfo['transition_scene_index'];
                resolve(transitionSceneIndex);
            })
            .catch(error => reject(error));
    });
}

function getTips(prefix) {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const tipInfos = storeInfo.general.tips;
                const tips = {
                    imageTip: tipInfos[prefix + 'image_tip'],
                    arrowTip: tipInfos[prefix + 'arrows_tip'],
                    hotspotTip: tipInfos[prefix + 'hotspot_tip']
                };
                resolve(tips);
            })
            .catch(error => reject(error));
    });
}

export function getDesktopTips() {
    return getTips('desktop_');
}

export function getMobileTips() {
    return getTips('mobile_');
}

export function productModalFieldsAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const productModalInfo = storeInfo.general['product_pop_up'];
                const productModalFields = {
                    showBrandName: productModalInfo['brand_name'],
                    showColor: productModalInfo['color'],
                    showDescription: productModalInfo['short_description'],
                    showPrice: productModalInfo['price'],
                    showAddToCart: productModalInfo['add_to_cart'],
                    productButtonCopy: productModalInfo['product_button_copy'],
                    addToCartCopy: productModalInfo['add_to_cart_copy']
                };
                resolve(productModalFields);
            })
            .catch(error => reject(error));
    });
}

export function getProductPricePrefixAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => resolve(storeInfo.general['currency']))
            .catch(error => reject(error));
    });
}

export function getTrackingParameter() {
    if (!data.trackingParameter) {
        console.log('No tracking parameter!');
        return '';
    }
    return data.trackingParameter;
}

export function getFontStylesAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const fontInfos = storeInfo.styling.fonts;
                const storeSelectorInfos = storeInfo.styling.section_selector_props || { 'title': '', 'category': '', 'sub_category': '' };
                const fontStyles = {
                    popUpTitle: {
                        name: fontInfos['pop_up_title'] ? fontInfos['pop_up_title'].name : '',
                        size: fontInfos['pop_up_title'] ? fontInfos['pop_up_title'].size : '',
                        weight: fontInfos['pop_up_title'] ? fontInfos['pop_up_title'].weight : '',
                        color: fontInfos['pop_up_title'] ? fontInfos['pop_up_title'].color : ''
                    },
                    popUpSubtitle: {
                        name: fontInfos['pop_up_image_subtitle'] ? `"${fontInfos['pop_up_image_subtitle'].name}"` : '',
                        size: fontInfos['pop_up_image_subtitle'] ? fontInfos['pop_up_image_subtitle'].size : '',
                        weight: fontInfos['pop_up_image_subtitle'] ? fontInfos['pop_up_image_subtitle'].weight : '',
                        color: fontInfos['pop_up_image_subtitle'] ? fontInfos['pop_up_image_subtitle'].color : ''
                    },
                    popUpText: {
                        name: fontInfos['pop_up_text'] ? fontInfos['pop_up_text'].name : '',
                        size: fontInfos['pop_up_text'] ? fontInfos['pop_up_text'].size : '',
                        weight: fontInfos['pop_up_text'] ? fontInfos['pop_up_text'].weight : '',
                        color: fontInfos['pop_up_text'] ? fontInfos['pop_up_text'].color : ''
                    },
                    buttonText: {
                        name: fontInfos['button_text'] ? fontInfos['button_text'].name : '',
                        size: fontInfos['button_text'] ? fontInfos['button_text'].size : '',
                        weight: fontInfos['button_text'] ? fontInfos['button_text'].weight : '',
                        color: fontInfos['button_text'] ? fontInfos['button_text'].color : ''
                    },
                    addToCartText: {
                        name: fontInfos['add_to_cart_button_text'] ? fontInfos['add_to_cart_button_text'].name : '',
                        size: fontInfos['add_to_cart_button_text'] ? fontInfos['add_to_cart_button_text'].size : '',
                        weight: fontInfos['add_to_cart_button_text'] ? fontInfos['add_to_cart_button_text'].weight : '',
                        color: fontInfos['add_to_cart_button_text'] ? fontInfos['add_to_cart_button_text'].color : ''
                    },
                    instructions: {
                        name: fontInfos['menu'] ? fontInfos['menu'].name : '',
                        size: fontInfos['menu'] ? fontInfos['menu'].size : '',
                        weight: fontInfos['menu'] ? fontInfos['menu'].weight : '',
                        color: fontInfos['menu'] ? fontInfos['menu'].color : ''
                    },
                    price: {
                        name: fontInfos['price'] ? fontInfos['price'].name : '',
                        size: fontInfos['price'] ? fontInfos['price'].size : '',
                        weight: fontInfos['price'] ? fontInfos['price'].weight : '',
                        color: fontInfos['price'] ? fontInfos['price'].color : ''
                    },
                    brandName: {
                        name: fontInfos['brand_name'] ? fontInfos['brand_name'].name : '',
                        size: fontInfos['brand_name'] ? fontInfos['brand_name'].size : '',
                        weight: fontInfos['brand_name'] ? fontInfos['brand_name'].weight : '',
                        color: fontInfos['brand_name'] ? fontInfos['brand_name'].color : ''
                    },
                    shortDescription: {
                        name: fontInfos['short_description'] ? fontInfos['short_description'].name : '',
                        size: fontInfos['short_description'] ? fontInfos['short_description'].size : '',
                        weight: fontInfos['short_description'] ? fontInfos['short_description'].weight : '',
                        color: fontInfos['short_description'] ? fontInfos['short_description'].color : ''
                    },
                    color: {
                        name: fontInfos['color'] ? fontInfos['color'].name : '',
                        size: fontInfos['color'] ? fontInfos['color'].size : '',
                        weight: fontInfos['color'] ? fontInfos['color'].weight : '',
                        color: fontInfos['color'] ? fontInfos['color'].color : ''
                    },
                    detailsTitles: {
                        name: fontInfos['details_titles'] ? fontInfos['details_titles'].name : '',
                        size: fontInfos['details_titles'] ? fontInfos['details_titles'].size : '',
                        weight: fontInfos['details_titles'] ? fontInfos['details_titles'].weight : '',
                        color: fontInfos['details_titles'] ? fontInfos['details_titles'].color : '',
                    },
                    detailsBody: {
                        name: fontInfos['details_body'] ? fontInfos['details_body'].name : '',
                        size: fontInfos['details_body'] ? fontInfos['details_body'].size : '',
                        weight: fontInfos['details_body'] ? fontInfos['details_body'].weight : '',
                        color: fontInfos['details_body'] ? fontInfos['details_body'].color : '',
                    },
                    detailsFooter: {
                        name: fontInfos['details_footer'] ? fontInfos['details_footer'].name : '',
                        size: fontInfos['details_footer'] ? fontInfos['details_footer'].size : '',
                        weight: fontInfos['details_footer'] ? fontInfos['details_footer'].weight : '',
                        color: fontInfos['details_footer'] ? fontInfos['details_footer'].color : '',
                    },
                    storeSelectorTitle: {
                        name: storeSelectorInfos['title'] ? storeSelectorInfos['title'].name : '',
                        size: storeSelectorInfos['title'] ? storeSelectorInfos['title'].size : '',
                        weight: storeSelectorInfos['title'] ? storeSelectorInfos['title'].weight : '',
                        color: storeSelectorInfos['title'] ? storeSelectorInfos['title'].color : ''
                    },
                    storeSelectorcategory: {
                        name: storeSelectorInfos['category'] ? storeSelectorInfos['category'].name : '',
                        size: storeSelectorInfos['category'] ? storeSelectorInfos['category'].size : '',
                        weight: storeSelectorInfos['category'] ? storeSelectorInfos['category'].weight : '',
                        color: storeSelectorInfos['category'] ? storeSelectorInfos['category'].color : '',
                        hoverColor: storeSelectorInfos['category'] ? storeSelectorInfos['category'].hover_color : '',
                    },
                    storeSelectorSubCategory: {
                        name: storeSelectorInfos['sub_category'] ? storeSelectorInfos['sub_category'].name : '',
                        size: storeSelectorInfos['sub_category'] ? storeSelectorInfos['sub_category'].size : '',
                        weight: storeSelectorInfos['sub_category'] ? storeSelectorInfos['sub_category'].weight : '',
                        color: storeSelectorInfos['sub_category'] ? storeSelectorInfos['sub_category'].color : '',
                        hoverColor: storeSelectorInfos['sub_category'] ? storeSelectorInfos['sub_category'].hover_color : '',
                    }


                }
                resolve(fontStyles);
            })
            .catch(error => reject(error));
    });
}

export function getFontNamedUrlsAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const fontFiles = storeInfo.styling['font_files'];
                const fontNamedUrls = [];
                for (let fontName in fontFiles) {
                    const urlObject = fontFiles[fontName]['url'];
                    const url = constructUrl(urlObject);
                    fontNamedUrls.push({
                        name: fontName,
                        url: url
                    });
                }
                resolve(fontNamedUrls);
            })
            .catch(error => reject(error));
    });
}

export function getGAIdJaredUSAAsync() {
    return new Promise((resolve, reject) => {
        const url = window.location.href;
        if (url.includes('jared.obsessvr.com') || url.includes('jared.com')) {
            return resolve(jaredGAUSAStagingID);
        }
    });
}

export function getGAIdJaredIndiaAsync() {
    return new Promise((resolve, reject) => {
        const url = window.location.href;
        if (url.includes('jared.obsessvr.com') || url.includes('jared.com')) {
            return resolve(jaredGAIndiaStagingID);
        }
    });
}

export function getGAIdAsync() {
    return new Promise((resolve, reject) => {
        const url = window.location.href;
        if (url.includes('0.0.0.0:3000') || url.includes('beta.obsessvr.com')) {
            console.log('Sending GA to dummy');
            return resolve(dummyGAId);
        } else {
            getStoreDataAsync()
                .then(storeInfo => {
                    if (storeInfo.general['google_analytics_id_prod']) {
                        console.log('Sending GA to prod');
                        return resolve(storeInfo.general['google_analytics_id_prod']);
                    } else {
                        console.log('Sending GA to dummy');
                        return resolve(dummyGAId);
                    }
                })
                .catch(error => reject(error));
        }
    });
}

export function getStoreSelectorExistAsync() {
    return new Promise((resolve, reject) => {
        getStoreSelectorDataAsync()
            .then(storesData => {
                return resolve(storesData.linked_stores && storesData.linked_stores.length > 0);
            })
            .catch(error => reject(error));
    });
}

export function getStoreSelectorDataAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                resolve(storeInfo.store_selector);
            })
            .catch(error => reject(error));
    });
}

export function getBottomSelectorDataAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                resolve(storeInfo.selectors);
            })
            .catch(error => reject(error));
    });
}

export function getStoreSelectorIconsAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                resolve([storeInfo.stores['globeIcon'], storeInfo.stores['selectedIcon']]);
            })
            .catch(error => reject(error));
    });
}

export function getStoreNameAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => resolve(storeInfo['name']))
            .catch(error => reject(error));
    });
}

export function getMusicIconGradient() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => resolve([storeInfo['styling']['music_top_color'], storeInfo['styling']['music_bottom_color']]))
            .catch(error => reject(error));
    });
}

export function getPopupBackgroundColor() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => resolve(storeInfo['styling']['popup_background_color']))
            .catch(error => reject(error));
    });
}

export function getPopupOpacity() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => resolve(storeInfo['styling']['popup_opacity']))
            .catch(error => reject(error));
    });
}

export function getExtendedProductData() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const productInfo = storeInfo['general']['product_pop_up'];
                resolve([productInfo['extended_product_pop_up'], productInfo['detail_title_1'], productInfo['detail_title_2']]);
            })
    })
}

export function getAddToCartEnabled() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const addToCartEnabled = storeInfo['general']['product_pop_up']['add_to_cart'];
                resolve(addToCartEnabled);
            }).catch(error => reject(error));
    })
}

export function getCurrentLiveUserCountAsync(storeId) {
    return new Promise((resolve, reject) => {
        if (!userGUID) {
            userGUID = getHeartBeatGUID();
        }

        const fetchUrl = `${apiUrl}/user/count`;
        const payload = {
            userId: userGUID,
            location: storeId
        };
        const fetchParams = {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "LocalReferrer": storeId
            }
        }

        fetch(fetchUrl, fetchParams)
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error('Fetch info failed with code ' + response.status);
                }
            })
            .then(data => {
                resolve(data.count);
            })
            .catch(reject);
    });
}

export function getWishlistStyleAsync() {
    return new Promise((resolve, reject) => {
        getStoreDataAsync()
            .then(storeInfo => {
                const fontStyles = storeInfo.general.wishlist_footer || { name: '', size: '', text: '', color: '', wrap_text: '' };
                resolve(fontStyles);
            })
            .catch(error => reject(error));
    });
}


function getPayload(method, url, request_body = null, headers = null) {
    let payload = {
        method: method,
        url: url
    }
    if (request_body) {
        payload["request_body"] = request_body
    }
    if (headers) {
        payload["headers"] = headers;
    }
    return payload;
}

export function fetchProxiedUrl(method, url, request_body = null, headers = null) {
    return new Promise((resolve, reject) => {
        const fetchUrl = `${apiUrl}request-proxy`;
        const payload = getPayload(method, url, request_body, headers);
        const fetchParams = {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            }
        }
        fetch(fetchUrl, fetchParams).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Fetch info failed with code ' + response.status);
            }
        })
            .then(responseJson => {
                if (responseJson['status_code'] === 200) {
                    // responseJson['response']['headers'] = responseJson['headers'];
                    resolve(responseJson['response']);
                }
                reject(responseJson)
            })
            .catch(error => reject(error));
    })
}


export function sendWishlistEmail(storeId, cartData, name, email, message, siteLogo) {
    return new Promise((resolve, reject) => {
        const fetchUrl = `${apiUrl}email-wishlist`;
        const payload = {
            id: storeId,
            cart_list: cartData,
            name: name,
            email: email,
            message: message,
            logo: siteLogo
        };
        const fetchParams = {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            }
        }

        fetch(fetchUrl, fetchParams)
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error('Send wishlist email failed with code ' + response.status);
                }
            })
            .then(data => {
                resolve(data.count);
            })
            .catch(reject);
    });
}


export function getDaysfromChristmas() {
    const today = new Date();
    var cmas = new Date(today.getFullYear(), 11, 25);
    var one_day = 1000 * 60 * 60 * 24;
    return Math.ceil((cmas.getTime() - today.getTime()) / (one_day))
}
