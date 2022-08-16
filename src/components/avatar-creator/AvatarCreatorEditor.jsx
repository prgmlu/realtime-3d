import React, { useState } from 'react';
import Body from './Body';
import Outfit from './Outfit';
import Face from './Face';
import './AvatarCreatorEditor.css'
import { svgBody, svgFace, svgOutfit } from './utils';

const AvatarCreatorEditor = (props) => {
    const [activeTab, setActiveTab] = useState(1);
    const currentAvatar = {};

    const onTabClick = (select) => {
        setActiveTab(select);
    }

    return (
        <div className='avatarCreatorEditor'>
            <div className="settings">
                <div className={activeTab==1 ? 'activeTab' : 'inactiveTab'} onClick={() => onTabClick(1)}>
                    {svgBody}
                </div>
                <div className={activeTab==2 ? 'activeTab' : 'inactiveTab'} onClick={() => onTabClick(2)}>
                    {svgFace}
                </div>
                <div className={activeTab==3 ? 'activeTab' : 'inactiveTab'} onClick={() => onTabClick(3)}>
                    {svgOutfit}
                </div>
            </div>        
            <div className="content">
                { activeTab == 1 && <Body /> }
                { activeTab == 2 && <Face /> }
                { activeTab == 3 && <Outfit currentScene={props?.currentScene} /> }
            </div>
        </div>
    );
}
export default AvatarCreatorEditor;
