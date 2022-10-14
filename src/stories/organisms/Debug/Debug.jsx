import React from 'react';
import './Debug.css';
// Constants
import { DEBUG_ZINDEX } from '../../../constants/zIndex';

export const Debug = ({userState, gameState, performance, entityReducer}) => {
    const { viewportWorldLocation } = userState;
    const { entityState, entityDispatch } = entityReducer;
    return (
        <div className='debug' style={{zIndex: `${DEBUG_ZINDEX}`}}>
            <div className='position'>
                Position: {viewportWorldLocation[0].toFixed(2)}, 
                {viewportWorldLocation[1].toFixed(2)}, 
                {viewportWorldLocation[2].toFixed(2)}
            </div>
            <div className='tiles'>
                tilesFromServer: {Object.entries(gameState?.tilesFromServer || {}).length} 
            </div>
            { 
                entityState?.selectedUnits.length > 0 && 
                <div>Selected:
                   {entityState.selectedUnits.map((entity) => (
                   <div key={entity.id}>{entity.id}<br />x: {entity.position[0]}<br />y: {entity.position[1]}<br />z: {entity.position[2]}</div>
                   ))}
                </div>
            }
            {
                entityState?.hoverEntities &&
                <div>
                    {entityState.hoverEntities.map((entity) => (
                   <div key={entity.id}>{entity.name} {entity.id}</div>
                   ))}
                </div>
            }
            { 
                Object.keys(entityState?.myEntities).length > 0 && 
                <div>myEntities.length {Object.keys(entityState.myEntities).length}
                {Object.entries(entityState.myEntities).map(([id, entity]) => (
                   <div key={entity.id}>{entity.id}<br />x: {entity.position[0]}<br />y: {entity.position[1]}<br />z: {entity.position[2]}</div>
                   ))}
                </div>
            }
        </div>
    );
}