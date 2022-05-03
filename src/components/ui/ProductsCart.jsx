import React, { Component } from 'react'
import './ProductsCart.css';

const cartIcon = "https://cdn.obsess-vr.com/Cart_Icon.png";

export default class ProductsCart extends Component {
	constructor(){
		super()
        this.productsNumber = 0;
	}

	render() {
		return (
            <div className='products-cart-button'>
                <img className='products-cart-icon' src={cartIcon} />
                <div className='products-cart-number'>
                    <p>{this.productsNumber}</p>
                </div>
            </div>
        )
    }
}