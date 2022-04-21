import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { loadUIImageAsync } from '../../../utils/AssetLoader.js';

class BaseImage extends Component {
    constructor(props) {
        super(props);
        this.loadSprite = this.loadSprite.bind(this);

        this.state = {
            src: props.src,
            loaded: false
        }
    }

    loadSprite(url) {
        if (!url) {
            return;
        }
        loadUIImageAsync(url)
        .then((image) => {
            this.setState({
                src: image.src,
                loaded: true
            });
        })
        .catch((error) => {
            // TODO: retry logic
            console.error('Download image error', error);
        });
    }

    render() {
        if (!this.state.loaded) {
            this.loadSprite(this.props.src);
        }
        return (
            <img
                src={this.state.src}
                style={this.props.style}
                onLoad={this.props.onImageLoaded}
            />
        );
    }
}

BaseImage.propTypes = {
    src: PropTypes.string.isRequired,
    style: PropTypes.object,
    onImageLoaded: PropTypes.func
};

export default BaseImage;
