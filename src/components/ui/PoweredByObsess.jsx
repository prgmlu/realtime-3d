import React, { Component } from 'react';
import BaseImage from './image-components/BaseImage';
import { getObsessLogoAsync } from '../../utils/StaticAssetManager';
import { isMobileDevice } from '../../utils/DeviceDetector';
import './BottomBarRight.css';

const obsessLogoStyle = {
    maxWidth: '100%',
    width: '3.5em',
    paddingLeft: '0.15em',
    cursor:'pointer',
};

const defualtObsessUrl = 'http://www.obsessAR.com/';
const isMobile = isMobileDevice();

class PoweredByObsess extends Component {
    constructor(props) {
        super(props);
        this.goToObsessUrl = this.goToObsessUrl.bind(this);
        this.logoOnClick = null;
        this.logoOnTouchEnd = null;
        this.tipOnClick = null;
        this.tipOnTouchEnd = null;
        if (isMobile) {
            this.logoOnTouchEnd = this.goToObsessUrl;
            this.tipOnTouchEnd = this.toggleTipPanel;
        } else {
            this.logoOnClick = this.goToObsessUrl;
            this.tipOnClick = this.toggleTipPanel;
        }

        this.state = {
            obsessLogoSrc: '',
            obsessUrl: defualtObsessUrl,
        };
    }

    componentDidMount() {
        getObsessLogoAsync()
            .then(url => this.setState({ obsessLogoSrc: url }))
            .catch(error => console.error(error));
    }

    goToObsessUrl() {
        this.setState({
            isTipShowing: false,
            isDisclaimerShowing: false
        });
        window.open(this.state.obsessUrl, '_blank');
    }

    render() {
        return (<div style={{float: 'right', marginRight: '0.5em'}}>
            <div
                className='hoverable'
                onClick={this.logoOnClick}
                onTouchEnd={this.logoOnTouchEnd}
            >
                <div>
                    <p style={{color:'red', cursor:'pointer'}}>Powered by</p>
                </div>
                <div id='bottomBarObsessLogoWrapper'>
                    <BaseImage
                        src={this.state.obsessLogoSrc}
                        style={obsessLogoStyle}
                    />
                </div>
            </div>
        </div>
        );
    }

}

export default PoweredByObsess;
