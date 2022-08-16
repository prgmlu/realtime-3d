import React, { useState } from 'react';
import { colors, svgCircle } from './utils';
import './Body.css';

const colorsStyle =  (color) => ({
    background: color,
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    cursor: 'pointer',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
})

const Body = () => {
    const [bodyType, setBodyType] = useState('male');
    const [colorIndex, setColorIndex] = useState(1);

    return (
        <div className='bodyTypeEditor'>
            <div className="shapeTitle">Body shape</div>
            <div
                id='male'
                className={bodyType=='male' ? 'selectedButton' : 'notSelectedButton'}
                onClick={(e) => setBodyType(e.target.id)}
            >Masculin
            {bodyType=='male' &&
                <div className="selectedCircleButton">
                   {svgCircle} 
                </div>}
            </div>

            <div
                id='female'
                className={bodyType=='female' ? 'selectedButton' : 'notSelectedButton'}
                onClick={(e) => setBodyType(e.target.id)}
            >
            Feminine
            {bodyType=='female' &&
                <div className="selectedCircleButton">
                   {svgCircle} 
                </div>}
            </div>
            <div className="skinTitle">Skin tone</div>
            <div className='skinColors'>
            {colors.map((color, index) => (
                <div id={index} key={index} style={colorsStyle(color)} onClick={(e) => setColorIndex(e.target.id)}>
                    <div className={colorIndex == index ? "selectedColor" : "notSelectedColor"}>
                        {colorIndex==index &&
                        <div className="selectedCircleColor">
                            {svgCircle} 
                        </div>}
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}
export default Body;