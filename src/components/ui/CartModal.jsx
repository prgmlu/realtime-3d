import React, { Component } from 'react';
import './CartModal.css';

export default class CartModal extends Component {
    constructor(props) {
        super(props);
        this.cartItems = props?.cartItems;
        this.closeModal = props?.closeModal;
        this.storeItems = props?.storeItems;
    }

    render() {
        return (
            <div id='cartBlur'>
                <div id='cartModal'>
                    <div id='closeButton'
                        onClick={(e) => {
                            e.stopPropagation();
                            this.closeModal();
                        }}>
                            <img
                                src="https://cdn.obsess-vr.com/modal-close-icon-normal.png"
                                style={{
                                    maxWidth: '100%',
                                    width: '2.8em',
                                    float: 'right',
                                }}
                            ></img>
                    </div>
                    <div id='cartContainer'>
                        {this.cartItems.map((item) => {return(

                            <img style={{width:'200px', height:'200px'}} id={item.itemNum} src={this.storeItems.filter(storeItem => {return storeItem.id === item.itemID})[0].img}/>
                        )})}
                    </div>
                </div>
            </div>
        );
    }
}