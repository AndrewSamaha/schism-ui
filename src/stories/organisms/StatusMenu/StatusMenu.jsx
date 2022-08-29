import React from 'react';
import first from 'lodash/first';
import backgroundImage from "../../assets/ui/StatusMenu/background.png";
// Components
import { Gold } from '../../atoms/Resources/Gold/Gold';
// Constants
import { STATUSMENU_ZINDEX } from '../../../constants/zIndex';
import { ResourceContainer } from '../../atoms/Resources/ResourceContainer';

export const StatusMenu = ({userState, gameState, performance, entityReducer}) => {
    const { viewportWorldLocation, resources } = userState;
    const { entityState, entityDispatch } = entityReducer;
    const selected = first(entityState.selectedUnits);

    return (
        <div class='StatusMenu' style={{
            zIndex: `${STATUSMENU_ZINDEX}`,
            backgroundImage: `url(${backgroundImage})`,
            width: '300px',
            height: '700px',
            padding: '12px',
            boxSizing: 'border-box'}}>
            {/* <div className='position'>
                Position: {viewportWorldLocation[0].toFixed(2)}, 
                {viewportWorldLocation[1].toFixed(2)}, 
                {viewportWorldLocation[2].toFixed(2)}
            </div>
            <div className='tiles'>
                tilesFromServer: {Object.entries(gameState?.tilesFromServer || {}).length} 
            </div> */}
            <div className='ResourceList'>
                {Object.entries(resources).map(([resourceName, amount]) => (<ResourceContainer resourceName={resourceName} amount={amount}/>))}
            </div>
            { 
                selected && 
                <div>
                    {selected.name}
                   {first(entityState.selectedUnits).actions.map((action) => (
                   action.ButtonComponent()
                   ))}
                </div>
            }
        </div>
    );
}