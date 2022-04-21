import React, { Component } from 'react';
import { getBackgroundMusicUrlAndStartStatus } from '../../utils/StoreConfigManager.js';
import { MusicButton } from '../../utils/Analytics.js';
import { isMobileDevice } from '../../utils/DeviceDetector';
import SocialButton from './buttons/SocialButton';
import './MusicController.css';
import '../ui/buttons/SocialButton.css';

const isMobile = isMobileDevice();

let hidden;
let visibilityChangeEventName;

if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChangeEventName = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChangeEventName = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChangeEventName = "webkitvisibilitychange";
}

const defaultTopColor = ' ';
const defaultBottomColor = 'black';
const musicOnIcon = 'https://cdn.obsess-vr.com/jared/music-on.png';
const musicOffIcon = 'https://cdn.obsess-vr.com/jared/music-off.png';


export default class MusicController extends Component {
    constructor(props) {
        super(props);

        this.toggleMusic = this.toggleMusic.bind(this);
        this.onVisibilityChanged = this.onVisibilityChanged.bind(this);
        this.onClick = this.onClick.bind(this);
        this.playAudio = this.playAudio.bind(this);

        this.state = {
            isAudioOn: false,
            playOnStart: false,
            backgroundMusicUrl: '',
            audio: null,
            setMusicIcon:musicOffIcon
        };
        

        getBackgroundMusicUrlAndStartStatus()
            .then(urlAndStatus => {
                const url = urlAndStatus.url;
                const playOnStart = urlAndStatus.playOnStart;
                if (url) {
                    document.addEventListener(visibilityChangeEventName, this.onVisibilityChanged, false);
                    const audio = new Audio(url);
                    audio.volume = 0.3;
                    audio.loop = true;

                    this.setState({
                        backgroundMusicUrl: url,
                        audio,
                        playOnStart
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
        }

    componentDidMount() {
        if (isMobile) {
            window.addEventListener('touchend', this.onClick);
        } else {
            window.addEventListener('click', this.onClick);
        }
    }

    componentWillUnmount() {
        document.removeEventListener(visibilityChangeEventName, this.onVisibilityChanged);
    }

    onClick() {
        const { playOnStart, audio } = this.state;

        if (audio) {
            if (playOnStart) {
                this.playAudio();
            }
        }
    }

    playAudio() {
        var playPromise = this.state.audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                this.setState({
                    isAudioOn: true
                });
                this.setState({ setMusicIcon: musicOnIcon });
                if (isMobile) {
                    window.removeEventListener('touchend', this.onClick);
                } else {
                    window.removeEventListener('click', this.onClick);
                }
            })
                .catch(error => {
                    console.log(error);
                    this.setState({ setMusicIcon: musicOffIcon });
                    this.setState({
                        isAudioOn: false
                    });
                });
        }
    }

    pauseAudio = () => {
        this.state.audio.pause();
    }

    onVisibilityChanged() {
        if (!this.state.backgroundMusicUrl) {
            return;
        }

        if (document[hidden] && this.state.audio) {
            this.state.audio.pause();
        } else {
            if (this.state.isAudioOn && this.state.audio) {
                this.playAudio();
            }
        }
    }

    toggleMusic() {
        if (!this.state.backgroundMusicUrl) {
            return;
        }

        const isAudioOn = !this.state.isAudioOn;

        if (isAudioOn) {
            this.playAudio();
            this.setState({ setMusicIcon: musicOnIcon });
        } else {
            this.pauseAudio();
            this.setState({ setMusicIcon: musicOffIcon });
        }

        this.setState({
            isAudioOn
        });

        MusicButton(this.state.isAudioOn);
    }

    render() {
        const { setMusicIcon } = this.state;

        return (
            <SocialButton onClick={this.toggleMusic} isMobile={isMobile}>
                <div id='audio-bar-container'>
                    <img src={setMusicIcon} className="audio-icon" />
                </div>
            </SocialButton>
        );
    }
}