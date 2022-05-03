import React, { Component } from 'react'
import './CartButton.css';

const cartIcon = "https://cdn.obsess-vr.com/Cart_Icon.png";

export default class CartButton extends Component {
	constructor(){
		super()
	}

	render() {
		return (
            <div className='cart-button'>
                <img className='cart-icon' src={cartIcon} />
            </div>
        )
    }
}