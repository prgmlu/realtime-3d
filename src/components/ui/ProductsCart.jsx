import React, { Component } from 'react'
import './ProductsCart.css';

const cartIcon = "https://cdn.obsess-vr.com/Cart_Icon.png";

export default class ProductsCart extends Component {
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