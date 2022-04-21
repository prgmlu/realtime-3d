import { getGAIdAsync, getGAIdJaredIndiaAsync, getGAIdJaredUSAAsync } from './StoreConfigManager.js';

const missedVirtualPagePaths = [];
const missedEvents = [];
let storeName = '';

export function setStoreName(name) {
    storeName = name;
}

export function sendMissedAnalyticsOnGALoaded(id) {
    missedVirtualPagePaths.forEach(element => {
        console.log('sending missed virtual page paths', element);
        window.gtag('config', id, { 'page_path': element });
    });

    missedEvents.forEach(element => {
        console.log('sending missed events', element);
        const category = element['event_category'];
        const action = element['event_action'];
        const label = element['event_label'];
        window.gtag('event', 'play', {
            'event_category': category,
            'event_action': action,
            'event_label': label
        });
    });
}

const AtLeastOnce = {
    EventCategory: 'At least once',
    Props: {
        MovedOnce: {
            EventAction: 'Moved once',
            EventLabel: 'Moved once',
            called: false
        },
        ProductHotspotOnce: {
            EventAction: 'Product hotspot once',
            EventLabel: 'Product hotspot once',
            called: false
        },
        BuyNowOnce: {
            EventAction: 'Buy now once',
            EventLabel: 'Buy now once',
            called: false
        },
        InteractedOnce: {
            EventAction: 'Interacted once',
            EventLabel: 'Interacted once',
            called: false
        }
    }
}

const Navigation = {
    EventCategory: 'Navigation',
    Props: {
        SceneLoaded: {
            EventAction: 'Scene loaded',
            EventLabel: ''
        },
        ArrowClicked: {
            EventAction: 'Arrow clicked',
            EventLabel: ''
        },
        NavigationMenuClicked: {
            EventAction: 'Navigation menu clicked',
            EventLabel: ''
        },
        WelcomePopUpClicked: {
            EventAction: 'Welcome pop-up clicked',
            EventLabel: 'Welcome Pop-up - clicked'
        }
    }
}

const Wishlist = {
    EventCategory: 'Wishlist',
    Props: {
        AddedToWishlist: {
            EventAction: 'Product Added to Wishlist',
            EventLabel: 'Product Added to Wishlist'
        },
        WishlistIconClicked: {
            EventAction: 'Wishlist Icon clicked',
            EventLabel: 'Wishlist Icon clicked'
        },
        EmailButtonClicked: {
            EventAction: 'Email button clicked',
            EventLabel: 'Email button clicked'
        },
        SendEmailButtonClicked: {
            EventAction: 'SEND EMAIL button clicked',
            EventLabel: 'SEND EMAIL button clicked'
        }
    }
}

const CountDown = {
    EventCategory: 'Countdown',
    Props: {
        CountdownIconClicked: {
            EventAction: 'Countdown icon clicked',
            EventLabel: 'Countdown icon clicked'
        },
        FacebookIconClicked: {
            EventAction: 'Facebook icon clicked',
            EventLabel: 'Facebook icon clicked'
        },
        InstagramIconClicked: {
            EventAction: 'Instagram icon clicked',
            EventLabel: 'Instagram icon clicked'
        },
        YoutubeIconClicked: {
            EventAction: 'Youtube icon clicked',
            EventLabel: 'Youtube icon clicked'
        },
        TwitterIconClicked: {
            EventAction: 'Twitter icon clicked',
            EventLabel: 'Twitter icon clicked'
        },
        PinterestIconClicked: {
            EventAction: 'Pinterest icon clicked',
            EventLabel: 'Pinterest icon clicked'
        },
        CopyLinkClicked: {
            EventAction: 'Copy link clicked',
            EventLabel: 'Copy link clicked'
        }
    }
}

const VirtualAssistant = {
    EventCategory: 'Virtual Assistant',
    Props: {
        VirtualAssistantIconClicked: {
            EventAction: 'Virtual Assistant icon clicked',
            EventLabel: 'Virtual Assistant icon clicked'
        }
    }
}

const ToolTips = {
    EventCategory: 'Tool Tips',
    Props: {
        ExploreNowButtonClicked: {
            EventAction: 'Explore Now button clicked',
            EventLabel: 'Explore Now button clicked'
        }
    }
}

const Product = {
    EventCategory: 'Product',
    Props: {
        ProductHotspotClicked: {
            EventAction: 'Product hotspot clicked',
            EventLabel: '<Product name> - <SKU>'
        },
        BuyNowClicked: {
            EventAction: 'Buy now clicked',
            EventLabel: '<Product name> - <SKU>'
        },
        AddedProductToFavorite: {
            EventAction: 'Favorite added',
            EventLabel: '<Product name> - <SKU>'
        },
        RemovedProductFromFavorite: {
            EventAction: 'Favorite removed',
            EventLabel: '<Product name> - <SKU>'
        },
        SpinActivated: {
            EventAction: 'Spin Activated',
            EventLabel: '<Product name> - <SKU>'
        },
        ColorSelectorActivated: {
            EventAction: 'Color selector activated',
            EventLabel: '<Product name> - <SKU>'
        },
        ColorSelectorOptionClicked: {
            EventAction: 'Color selector option clicked',
            EventLabel: '<Product name> - <Product color>'
        },
        AddToWishlistClicked: {
            EventAction: 'Add to wishlist clicked',
            EventLabel: '<Product name> - <SKU>'
        },
        DetailsClicked: {
            EventAction: 'Details clicked',
            EventLabel: '<Product name> - <SKU>'
        },
        ThumbnailClicked: {
            EventAction: 'Thumbnail clicked',
            EventLabel: '<Product name> - <SKU>'
        },
        VideoIconClicked: {
            EventAction: 'Video icon clicked',
            EventLabel: '<Product name> - <SKU>'
        },
        BookAppointmentButton: {
            EventAction: 'Book an appointment clicked',
            EventLabel: '<Product name> - <SKU>'
        }
    }
}

const Other = {
    EventCategory: 'Other',
    Props: {
        LogoClicked: {
            EventAction: 'Logo clicked',
            EventLabel: 'Logo clicked'
        },
        WelcomeTipsDismissed: {
            EventAction: 'Welcome tips dismissed',
            EventLabel: 'Welcome tips dismissed'
        },
        MusicButton: {
            EventAction: 'Music button',
            EventLabel: 'on / off'
        },
        FacebookButton: {
            EventAction: 'Facebook button',
            EventLabel: 'Facebook button'
        },
        TwitterButton: {
            EventAction: 'Twitter button',
            EventLabel: 'Twitter button'
        },
        WhatsAppButton: {
            EventAction: 'WhatsApp button',
            EventLabel: 'WhatsApp button'
        },
        ObsessLogo: {
            EventAction: 'Obsess logo',
            EventLabel: 'Obsess logo'
        },
        BrandLogo: {
            EventAction: 'Brand logo',
            EventLabel: 'Brand logo'
        },
        Email: {
            EventAction: 'Email',
            EventLabel: 'Entered / skipped'
        },
        StoreSelectorIcon: {
            EventAction: 'Store selector icon clicked',
            EventLabel: ''
        },
        StoreSelectorOption: {
            EventAction: 'Store selector option clicked',
            EventLabel: '<store name>'
        },
        WishlistIconClicked: {
            EventAction: 'Wishlist icon clicked',
            EventLabel: '<Scene slug>'
        },
        LivePersonChat: {
            EventAction: 'Chat button clicked',
            EventLabel: 'Jared Brilliance Within - chat button clicked'
        },
        WishlistEmailedButtonClicked: {
            EventAction: 'Wishlist email button clicked',
            EventLabel: 'wishlist email button'
        },
        WishlistSendEmailButtonClicked: {
            EventAction: 'Wishlist send email button clicked',
            EventLabel: 'wishlist send email'
        },
    }
}

const Content = {
    EventCategory: 'Content',
    Props: {
        InSceneVideoClicked: {
            EventAction: 'In-scene video',
            EventLabel: '<video title> - <video filename>'
        },
        PopupVideoClicked: {
            EventAction: 'Pop-up video',
            EventLabel: '<video name>'
        },
        ImageClicked: {
            EventAction: 'Image',
            EventLabel: '<image name>'
        },
        TextClicked: {
            EventAction: 'Text',
            EventLabel: ''
        },
        LinkClicked: {
            EventAction: 'Link',
            EventLabel: '<target url>'
        },
        TextPopUpHotSpotClicked: {
            EventAction: 'Text pop-up',
            EventLabel: '<store name> - <view name>'
        },
        TextPopUpButtonClicked: {
            EventAction: 'Text pop-up button clicked',
            EventLabel: '<store name> - <view name>'
        },
        SoundHotspotClicked: {
            EventAction: 'Sound hotspot clicked',
            EventLabel: 'Sound hotspot clicked - '
        },
        EngagementRingWidget: {
            EventAction: 'Design engagement ring widget clicked',
            EventLabel: 'design engagement ring widget clicked'
        },
        RecipeHotspotsClicked: {
            EventAction: 'Recipe hotspot clicked',
            EventLabel: 'Recipe hotspot clicked'
        },
        CalendarIconClicked: {
            EventAction: 'Calendar icon clicked',
            EventLabel: 'Calander icon clicked'
        },
    }
}

function sendUserAction(eventCategory, eventAction, eventLable) {
    if (!window.gtag) {
        console.log('no gtag');
        const missedEvent = {
            'event_category': eventCategory,
            'event_action': eventAction,
            'event_label': storeName + ' - ' + eventLable
        };
        missedEvents.push(missedEvent)
        return;
    }
    window.gtag('event', 'play', {
        'event_category': eventCategory,
        'event_action': eventAction,
        'event_label': storeName + ' - ' + eventLable
    });
    // var analytics = window.analytics;
    // analytics.track(eventAction, {
    //     'category': eventCategory,
    //     'action': eventAction,
    //     'label': storeName + ' ' + eventLable
    // });
}

// At Least Once
export function MovedOnce() {
    let prop = AtLeastOnce.Props.MovedOnce;
    if (prop.called) {
        return;
    }
    prop.called = true;
    sendUserAction(AtLeastOnce.EventCategory, prop.EventAction, prop.EventLabel);
}

export function ProductHotspotOnce() {
    let prop = AtLeastOnce.Props.ProductHotspotOnce;
    if (prop.called) {
        return;
    }
    prop.called = true;
    sendUserAction(AtLeastOnce.EventCategory, prop.EventAction, prop.EventLabel);
}

export function BuyNowOnce() {
    let prop = AtLeastOnce.Props.BuyNowOnce;
    if (prop.called) {
        return;
    }
    prop.called = true;
    sendUserAction(AtLeastOnce.EventCategory, prop.EventAction, prop.EventLabel);
}

export function InteractedOnce() {
    let prop = AtLeastOnce.Props.InteractedOnce;
    if (prop.called) {
        return;
    }
    prop.called = true;
    sendUserAction(AtLeastOnce.EventCategory, prop.EventAction, prop.EventLabel);
}

// Navigation
export function NavigationMenuClicked(sceneName) {
    let prop = Navigation.Props.NavigationMenuClicked;
    let eventLabel = sceneName;
    sendUserAction(Navigation.EventCategory, prop.EventAction, eventLabel);
}

export function SceneLoaded(sceneId) {
    console.log('sceneloaded', sceneId);
    let prop = Navigation.Props.SceneLoaded;
    sendUserAction(Navigation.EventCategory, prop.EventAction, prop.EventLabel + sceneId);
}

export function ArrowClicked(destinationSceneId) {
    let prop = Navigation.Props.ArrowClicked;
    sendUserAction(Navigation.EventCategory, prop.EventAction, prop.EventLabel + destinationSceneId);
}

//Wishlist
export function ProductAddedToWishlist() {
    let prop = Wishlist.Props.AddedToWishlist;
    sendUserAction(Wishlist.EventCategory, prop.EventAction, prop.EventLabel);
}

export function WishlistIconClickedNew() {
    let prop = Wishlist.Props.WishlistIconClicked;
    sendUserAction(Wishlist.EventCategory, prop.EventAction, prop.EventLabel);
}

export function EmailButtonClicked() {
    let prop = Wishlist.Props.EmailButtonClicked;
    sendUserAction(Wishlist.EventCategory, prop.EventAction, prop.EventLabel);
}

export function SendEmailButtonClicked() {
    let prop = Wishlist.Props.SendEmailButtonClicked;
    sendUserAction(Wishlist.EventCategory, prop.EventAction, prop.EventLabel);
}

//Countdown
export function CountdownIconClicked() {
    let prop = CountDown.Props.CountdownIconClicked;
    sendUserAction(CountDown.EventCategory, prop.EventAction, prop.EventLabel);
}

export function FacebookIconClicked() {
    let prop = CountDown.Props.FacebookIconClicked;
    sendUserAction(CountDown.EventCategory, prop.EventAction, prop.EventLabel);
}

export function InstagramIconClicked() {
    let prop = CountDown.Props.InstagramIconClicked;
    sendUserAction(CountDown.EventCategory, prop.EventAction, prop.EventLabel);
}

export function YoutubeIconClicked() {
    let prop = CountDown.Props.YoutubeIconClicked;
    sendUserAction(CountDown.EventCategory, prop.EventAction, prop.EventLabel);
}

export function TwitterIconClicked() {
    let prop = CountDown.Props.TwitterIconClicked;
    sendUserAction(CountDown.EventCategory, prop.EventAction, prop.EventLabel);
}

export function PinterestIconClicked() {
    let prop = CountDown.Props.PinterestIconClicked;
    sendUserAction(CountDown.EventCategory, prop.EventAction, prop.EventLabel);
}

export function CopyLinkClicked() {
    let prop = CountDown.Props.CopyLinkClicked;
    sendUserAction(CountDown.EventCategory, prop.EventAction, prop.EventLabel);
}

//Virtual Assistant
export function VirtualAssistantIconClicked() {
    let prop = VirtualAssistant.Props.VirtualAssistantIconClicked;
    sendUserAction(VirtualAssistant.EventCategory, prop.EventAction, prop.EventLabel);
}

//ToolTips
export function ExploreNowButtonClicked() {
    let prop = ToolTips.Props.ExploreNowButtonClicked;
    sendUserAction(ToolTips.EventCategory, prop.EventAction, prop.EventLabel);
}

// Product
export function ProductHotspotClicked(sku, productName) {
    console.log('Product hotspot clicked:', productName, sku);
    let prop = Product.Props.ProductHotspotClicked;
    sendUserAction(Product.EventCategory, prop.EventAction, productName + ' - ' + sku);
}

export function BuyNowClicked(sku, productName) {
    console.log('Buy now clicked:', productName, sku);
    let prop = Product.Props.BuyNowClicked;
    sendUserAction(Product.EventCategory, prop.EventAction, productName + ' - ' + sku);
}

export function SpinActivated(sku, productName) {
    console.log('Spin Activated:', productName, sku);
    let prop = Product.Props.SpinActivated;
    sendUserAction(Product.EventCategory, prop.EventAction, productName + ' - ' + sku);
}

export function ColorSelectorActivated(sku, productName) {
    let prop = Product.Props.ColorSelectorActivated;
    sendUserAction(Product.EventCategory, prop.EventAction, `${productName}-${sku}`)
}

export function ColorSelectorOptionClicked(productColor, productName) {
    let prop = Product.Props.ColorSelectorOptionClicked;
    sendUserAction(Product.EventCategory, prop.EventAction, `${productName}-${productColor}`)
}

export function AddedHeartItem(sku, productName) {
    let prop = Product.Props.AddedProductToFavorite;
    sendUserAction(Product.EventCategory, prop.EventAction, productName + ' - ' + sku);
}

export function RemovedHeartItem(sku, productName) {
    let prop = Product.Props.RemovedProductFromFavorite;
    sendUserAction(Product.EventCategory, prop.EventAction, productName + ' - ' + sku);
}

export function AddToWishlistClicked(sku, productName) {
    console.log('Add to wishlist clicked:', productName, sku);
    let prop = Product.Props.AddToWishlistClicked;
    sendUserAction(Product.EventCategory, prop.EventAction, productName + ' - ' + sku);
}

export function DetailsClicked(sku, productName) {
    let prop = Product.Props.DetailsClicked;
    sendUserAction(Product.EventCategory, prop.EventAction, `${productName} - ${sku}`);
}

export function ThumbnailClicked(sku, productName) {
    let prop = Product.Props.ThumbnailClicked;
    sendUserAction(Product.EventCategory, prop.EventAction, `${productName} - ${sku}`);
}

export function VideoIconClicked(sku, productName) {
    let prop = Product.Props.VideoIconClicked;
    sendUserAction(Product.EventCategory, prop.EventAction, `${productName} - ${sku}`);
}
export function BookAppointmentButton(sku, productName) {
    let prop = Product.Props.BookAppointmentButton;
    sendUserAction(Product.EventCategory, prop.EventAction, `${productName} - ${sku}`);
}

// Other
export function LogoClicked() {
    let prop = Other.Props.LogoClicked;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function WelcomeTipsDismissed() {
    let prop = Other.Props.WelcomeTipsDismissed;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function MusicButton(isOn) {
    let eventLabel = isOn ? 'on' : 'off';
    let prop = Other.Props.MusicButton;
    sendUserAction(Other.EventCategory, prop.EventAction, eventLabel);
}

export function FacebookButtonAnalytics() {
    let prop = Other.Props.FacebookButton;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function TwitterButtonAnalytics() {
    let prop = Other.Props.TwitterButton;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function WhatsAppButtonAnalytics() {
    let prop = Other.Props.WhatsAppButton;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function ObsessLogo() {
    let prop = Other.Props.ObsessLogo;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function BrandLogo() {
    let prop = Other.Props.BrandLogo;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function Email() {
    let prop = Other.Props.Email;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function StoreSelectorIcon() {
    let prop = Other.Props.StoreSelectorIcon;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function StoreSelectorOption(storeName) {
    let prop = Other.Props.StoreSelectorOption;
    sendUserAction(Other.EventCategory, prop.EventAction, storeName);
}

export function WishlistIconClicked(currentScene) {
    let prop = Other.Props.WishlistIconClicked;
    sendUserAction(Other.EventCategory, prop.EventAction, currentScene);
}

export function TextPopUpButtonClicked(currentSceneName, viewName) {
    console.log("popup");
    //const updateTitle = currentSceneName === "lounge" ? "instagram" : currentSceneName === "learning-wall" ? viewName : ''
    let prop = Content.Props.TextPopUpButtonClicked;
    sendUserAction(Content.EventCategory, prop.EventAction, `${currentSceneName} - ${viewName}`);
}

export function WishlistEmailedButtonClicked() {
    let prop = Other.Props.WishlistEmailedButtonClicked;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function WishlistSendEmailButtonClicked() {
    let prop = Other.Props.WishlistSendEmailButtonClicked;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}
// Media
export function InSceneVideoClicked(name) {
    let prop = Content.Props.InSceneVideoClicked;
    sendUserAction(Content.EventCategory, prop.EventAction, name);
}

export function PopupVideoClicked(name) {
    let prop = Content.Props.PopupVideoClicked;
    sendUserAction(Content.EventCategory, prop.EventAction, name);
}

export function ImageClicked(name) {
    let prop = Content.Props.ImageClicked;
    sendUserAction(Content.EventCategory, prop.EventAction, name);
}

export function TextClicked(title) {
    let prop = Content.Props.TextClicked;
    sendUserAction(Content.EventCategory, prop.EventAction, title);
}

export function LinkClicked(targetUrl) {
    let prop = Content.Props.LinkClicked;
    sendUserAction(Content.EventCategory, prop.EventAction, targetUrl);
}

export function LivePersonChatClicked() {
    let prop = Other.Props.LivePersonChat;
    sendUserAction(Other.EventCategory, prop.EventAction, prop.EventLabel);
}

export function SoundHotspotClicked(sceneName = '') {
    let prop = Content.Props.SoundHotspotClicked;
    sendUserAction(Content.EventCategory, prop.EventAction, prop.EventLabel + sceneName);
}
export function WelcomePopUpClicked() {
    let prop = Navigation.Props.WelcomePopUpClicked;
    sendUserAction(Navigation.EventCategory, prop.EventAction, prop.EventLabel);
}

export function EngagementRingWidget(sceneName = '') {
    let prop = Content.Props.EngagementRingWidget;
    sendUserAction(Content.EventCategory, prop.EventAction, prop.EventLabel);
}

export function RecipeHotspotsClicked(recipeName) {
    let prop = Content.Props.RecipeHotspotsClicked;
    sendUserAction(Content.EventCategory, prop.EventAction, `Jared Holiday - Recipe hotspot clicked - ${recipeName} `);
}

export function CalendarIconClicked() {
    let prop = Content.Props.CalendarIconClicked;
    sendUserAction(Content.EventCategory, prop.EventAction, prop.EventLabel);
}


// Page
export function VirtualPageVisited(pageUri) {
    if (!window.gtag) {
        console.log('no gtag');
        const path = storeName + '/' + pageUri;
        missedVirtualPagePaths.push(path);
        return;
    }
    getGAIdAsync()
        .then(id => {
            console.log('virtual page visited', pageUri);
            console.log('sending ga to', id);
            // window.gtag('config', id, { 'page_path': '/main/' + pageUri });
            window.gtag('config', id, { 'page_path': storeName + '/' + pageUri });
        })
        .catch(error => console.error(error));

    getGAIdJaredIndiaAsync()
        .then(id => {
            console.log('virtual page visited', pageUri);
            console.log('sending ga to', id);
            // window.gtag('config', id, { 'page_path': '/main/' + pageUri });
            window.gtag('config', id, { 'page_path': storeName + '/' + pageUri });
        })
        .catch(error => console.error(error));

    getGAIdJaredUSAAsync()
        .then(id => {
            console.log('virtual page visited', pageUri);
            console.log('sending ga to', id);
            // window.gtag('config', id, { 'page_path': '/main/' + pageUri });
            window.gtag('config', id, { 'page_path': storeName + '/' + pageUri });
        })
        .catch(error => console.error(error));
}
