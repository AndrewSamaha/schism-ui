import React from 'react';
import './Debug.css';

export const Debug = ({userState, gameState}) => {
    const { viewportWorldLocation } = userState;
    return (
        <div className='debug'>
            <div className='position'>
                Position: {viewportWorldLocation[0].toFixed(2)}, 
                {viewportWorldLocation[1].toFixed(2)}, 
                {viewportWorldLocation[2].toFixed(2)}
            </div>
            <div className='tiles'>
                tilesFromServer: {Object.entries(gameState?.tilesFromServer || {}).length} 
            </div>
        </div>
    );
}