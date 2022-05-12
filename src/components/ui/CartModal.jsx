import React, { Component } from 'react';
import './CartModal.css';

export default class CartModal extends Component {
    constructor(props) {
        super(props);
        this.cartItems = props?.cartItems;
        this.closeModal = props?.closeModal;
        this.setCartItems = props?.setCartItems;
        this.storeItems = props?.storeItems;
    }
    state = {
        cartItems : [],
    }

    onRemove = (e) => {
        let currentItems = [];
        for(let i=0; i<this.state.cartItems.length; i++){
            if(this.state.cartItems[i].itemNum != e.target.id){
                currentItems.push(this.state.cartItems[i]);
            }
        }
        this.setCartItems(currentItems);
		this.setState({cartItems: currentItems});
    }

    componentDidMount(){
        this.setState({cartItems : this.cartItems})
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
                        {this.state.cartItems.map((item) => {return(
                            <div className='cartItem' key={item.itemNum}>
                                <img style={{width:'200px', height:'200px'}}
                                        id={item.itemNum}
                                        src={this.storeItems.filter(storeItem => {return storeItem.id === item.itemID})[0].img}
                                />
                                <p>{this.storeItems.filter(storeItem => {return storeItem.id === item.itemID})[0].name}</p>
                                <p>{this.storeItems.filter(storeItem => {return storeItem.id === item.itemID})[0].price}</p>
                                <button type='button' id={item.itemNum} className='cartRemoveButton' onClick={this.onRemove}>Remove</button>
                            </div>
                        )})}
                    </div>
                </div>
            </div>
        );
    }
}