import React, { Component } from 'react';
import {ItemCollection} from '../items';

export default class CartModal extends Component {
    constructor(props) {
        super(props);
        this.cartItems = props?.cartItems;
        this.closeModal = props?.closeModal;
        this.storeItems = props?.storeItems;
        console.log(this.storeItems)
    }

    render() {
        return (
            <div
            id='blur'
            style={{
                width: '100%',
                height: '100%',
                backdropFilter: `blur(10px)`,
                WebkitBackdropFilter: `blur(10px)`,
                top:'0px',
                left:'0px',
                position: 'absolute',
            }}>
                <div
                id='modal'
                style={{
                    width: '75%',
                    height: '75%',
                    left: '50%',
                    top: '50%',
                    backgroundColor: 'white',
                    transform: 'translate(-50%, -50%)',
                    position: 'absolute',
                }}>

                            <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                this.closeModal();
                            }}
                            style={{
                                position: 'absolute',
                                background: '#340c0c',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                margin: 25 + 'px',
                                zIndex: 2,
                                right: '0',
                                top: '0',
                            }}
                        >
                            <img
                                src="https://cdn.obsess-vr.com/modal-close-icon-normal.png"
                                style={{
                                    maxWidth: '100%',
                                    width: '2.8em',
                                    float: 'right',
                                }}
                            ></img>
                        </div>
                        {this.cartItems.map((item) => {
                            return(
                                
                                <img style={{width:'200px', height:'200px'}} id={item.itemNum} src={this.storeItems.filter(storeItem => {return storeItem.id === item.itemID})[0].img}/>
                            )
                        })}
                </div>
            </div>
        );
    }
}