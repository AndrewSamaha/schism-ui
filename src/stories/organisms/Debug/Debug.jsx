import React from 'react';
import './Debug.css';

export const Debug = ({userState}) => {
    const { viewportWorldLocation } = userState;
    return (
        <div className='debug'>
            {viewportWorldLocation[0].toFixed(2)}, 
            {viewportWorldLocation[1].toFixed(2)}, 
            {viewportWorldLocation[2].toFixed(2)}
        </div>
    );
}