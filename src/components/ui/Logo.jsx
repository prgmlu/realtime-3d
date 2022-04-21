import React, { Component } from 'react';
import {  getTrackingParameter } from '../../utils/StoreConfigManager.js';
import { LogoClicked } from '../../utils/Analytics.js';
import InteractableElement from './InteractableElement';
import BaseImage from './image-components/BaseImage';
import './Logo.css';

const style = {
	width: '50%',
};

class Logo extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.state = {
			imageSrc: 'https://cdn.obsessvr.com/coco/coco-header-logo-blue.png',
			redirectUrl: '',
		};
	}

	onClick() {
		LogoClicked();
		const trackingParam = getTrackingParameter();
		const trackingParamUrl = `${this.state.redirectUrl}${
			this.state.redirectUrl.includes('?') ? '&' : '?'
		}${trackingParam}`;
		window.open(trackingParamUrl, '_blank');
	}

	render() {
		const imageSrc = this.state.imageSrc;
		if (!imageSrc) {
			return <React.Fragment />;
		}
		return (
			<div id="topLeftLogo" className="hoverable">
				<InteractableElement onClick={this.onClick}>
					<BaseImage src={imageSrc} style={style} />
				</InteractableElement>
			</div>
		);
	}
}

export default Logo;
