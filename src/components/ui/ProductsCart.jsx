import React, { Component } from 'react'
import { connect } from "react-redux";
import './ProductsCart.css';

const cartIcon = "https://cdn.obsess-vr.com/Cart_Icon.png";

class ProductsCart extends Component {
	constructor(props){
		super(props)
        this.cartItems = props?.cartItems;
        this.showModal = props?.showModal;
	}

	render() {
		return (
            <div className='products-cart-button' onClick={this.showModal}>
                <img className='products-cart-icon' src={cartIcon} />
                <div className='products-cart-number'>
                    <p>{this.cartItems?.length || 0}</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { cartData } = state
    if(cartData.item != 0){
        let itemNum = ownProps.cartItems.length + 1;
        ownProps.addToCart({itemID:cartData.item, itemNum:itemNum});
    }
    return { cartData }
}

export default connect(mapStateToProps)(ProductsCart);