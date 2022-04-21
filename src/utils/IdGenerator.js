function generateNewGUID() {
    const userGUIDArray = new Uint32Array(1);
    
    if (window.crypto) {
        window.crypto.getRandomValues(userGUIDArray);
    } else {
        window.msCrypto.getRandomValues(userGUIDArray);
    }

    const GUID = userGUIDArray[0];
    return GUID;
}

export function getHeartBeatGUID() {
    const heartBeatGUIDKey = 'obsessHeartBeatGUID';
    const localStorageGUID = localStorage.getItem(heartBeatGUIDKey);
    console.log('local storage guid', localStorageGUID);
    if (localStorageGUID) {
        console.log('returning local storage GUID')
        return localStorageGUID;
    };

    console.log('Generating new GUID');
    const userGUID = generateNewGUID();
    localStorage.setItem(heartBeatGUIDKey, userGUID);
    return userGUID;
}
