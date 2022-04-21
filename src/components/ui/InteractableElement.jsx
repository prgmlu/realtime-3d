import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';


// const isMobile = isMobileDevice();
const isMobile = false;

class InteractableElement extends PureComponent {
    render() {
        const { onHover, onUnhover, onClick } = this.props;
        if (isMobile) {
            return (
                <div
                    onTouchEnd={onClick}
                >
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <div
                    onClick={onClick}
                    onMouseOver={onHover}
                    onMouseOut={onUnhover}
                >
                    {this.props.children}
                </div>
            );
        }
    }
}

InteractableElement.propTypes = {
    onHover: PropTypes.func,
    onUnhover: PropTypes.func,
    onClick: PropTypes.func
};

export default InteractableElement;
