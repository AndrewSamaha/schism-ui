import React from 'react';
import backgroundImage from "../../../assets/textures/resources/gold1.png";


export const Gold = ({amount}) => {
    return (
        <div className='Gold' style={{
            backgroundImage: `url(${backgroundImage})`,
            width: '18px',
            height: '18px',
            boxSizing: 'border-box'}}>
            
        </div>
    );
}