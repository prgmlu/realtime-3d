import { getGAIdAsync, getGAIdJaredUSAAsync, getGAIdJaredIndiaAsync } from './StoreConfigManager.js';
import { sendMissedAnalyticsOnGALoaded } from './Analytics.js';

let storeName = '';

export function setGAHelperStoreName(name) {
    storeName = name;
}

export function loadGAAsync() {
    getGAIdAsync()
        .then(id => {
            console.log("ga-id-", id);
            const gaSrc = 'https://www.googletagmanager.com/gtag/js?id=' + id;
            const gaScript = document.createElement('script');
            gaScript.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', id);
                window.gtag = gtag;
                // This line tracks the page view and activates ga so we need to call it here
                // Because we call it here, we don't need to do retries in Analytics.js for virtual page visits.
                // gtag('config', id, { 'page_path': storeName + '/' });
                console.log('GA loaded!');

                sendMissedAnalyticsOnGALoaded(id);
            }
            gaScript.src = gaSrc;
            document.head.appendChild(gaScript);
        })
        .catch(error => console.error(error));
    
    getGAIdJaredUSAAsync()
        .then(id => {
            const gaSrc = 'https://www.googletagmanager.com/gtag/js?id=' + id;
            const gaScript = document.createElement('script');
            gaScript.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', id);
                window.gtag = gtag;
                // This line tracks the page view and activates ga so we need to call it here
                // Because we call it here, we don't need to do retries in Analytics.js for virtual page visits.
                // gtag('config', id, { 'page_path': storeName + '/' });
                console.log('GA loaded!');
    
                sendMissedAnalyticsOnGALoaded(id);
            }
            gaScript.src = gaSrc;
            document.head.appendChild(gaScript);
        })
        .catch(error => console.error(error));

    getGAIdJaredIndiaAsync()
        .then(id => {
            const gaSrc = 'https://www.googletagmanager.com/gtag/js?id=' + id;
            const gaScript = document.createElement('script');
            gaScript.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', id);
                window.gtag = gtag;
                // This line tracks the page view and activates ga so we need to call it here
                // Because we call it here, we don't need to do retries in Analytics.js for virtual page visits.
                // gtag('config', id, { 'page_path': storeName + '/' });
                console.log('GA loaded!');
    
                sendMissedAnalyticsOnGALoaded(id);
            }
            gaScript.src = gaSrc;
            document.head.appendChild(gaScript);
        })
        .catch(error => console.error(error));
}

