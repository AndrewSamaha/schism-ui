import React, { useMemo } from 'react';
import './Debug.css';
// Constants
import { DEBUG_ZINDEX } from '../../../constants/zIndex';
import { Position } from '@react-three/drei/helpers/Position';

export const Debug = ({userState, gameState, cameraPosition, performance, entityReducer}) => {
    const { viewportWorldLocation } = userState;
    const { entityState, entityDispatch } = entityReducer;

    const PositionOutput = useMemo(()=> {
        console.log(gameState?.camera?.ref?.current?.position?.x)
        return (<div className='position'>
            Position: {gameState?.camera?.ref?.current?.position?.x}, 
            {gameState?.camera?.ref?.current?.position?.y}, 
            {gameState?.camera?.ref?.current?.position?.z}
        </div>)
    },[cameraPosition?.x, cameraPosition?.y])
    return (
        <div className='debug' style={{zIndex: `${DEBUG_ZINDEX}`}}>
            (<div className='position'>
            Position: {cameraPosition?.x}, 
            {cameraPosition?.y}, 
            {cameraPosition?.z}
        </div>)
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
            {/* { 
                Object.keys(entityState?.myEntities).length > 0 && 
                <div>myEntities.length {Object.keys(entityState.myEntities).length}
                {Object.entries(entityState.myEntities).map(([id, entity]) => (
                   <div key={entity.id}>{entity.id}<br />
                   position={entity.position}<br />
                   x: {entity.position[0]}<br />y: {entity.position[1]}<br />z: {entity.position[2]}</div>
                   ))}
                </div>
            } */}
        </div>
    );
}