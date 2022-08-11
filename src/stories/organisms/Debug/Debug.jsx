import React from 'react';
import './Debug.css';

export const Debug = ({userState, gameState, performance, entityReducer}) => {
    const { viewportWorldLocation } = userState;
    const { entityState, entityDispatch } = entityReducer;
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
            { 
                entityState?.selectedUnits.length && 
                <div>
                   {entityState.selectedUnits.map((entity) => (<div key={entity.id}>{entity.id}</div>))}
                </div>
            }
        </div>
    );
}