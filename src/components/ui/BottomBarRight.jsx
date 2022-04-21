import React, { Component } from 'react';
import PoweredByObsess from '../ui/PoweredByObsess';
import MusicController from './MusicController.jsx';
import './BottomBarRight.css';


class BottomBarRight extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div id='bottomBarRight' style={{ bottom: '0.25em'}}>             
                <MusicController/>         
                <PoweredByObsess/>                         
            </div>
        );
    }
}

export default BottomBarRight;
