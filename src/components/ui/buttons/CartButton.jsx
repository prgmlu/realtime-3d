import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCartData } from '../../../redux_stores/cartReducer/actions';
import './CartButton.css';

const cartIcon = "https://cdn.obsess-vr.com/Cart_Icon.png";

class CartButton extends Component {
	constructor(props){
		super(props)
	}

    handleAddToCart = () => {
        this.props.setCartData(this.props.itemId)
      }

	render() {
		return (
            <div className='cart-button' onClick={this.handleAddToCart}>
                <img className='cart-icon' src={cartIcon} />
            </div>
        )
    }
}

export default connect(null, { setCartData })(CartButton)