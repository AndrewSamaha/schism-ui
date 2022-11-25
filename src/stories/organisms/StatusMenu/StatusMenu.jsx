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
        <div className='StatusMenu' style={{
            zIndex: `${STATUSMENU_ZINDEX}`,
            backgroundImage: `url(${backgroundImage})`,
            width: '300px',
            height: '700px',
            padding: '12px',
            boxSizing: 'border-box'}}>
           
            <div className='ResourceList'>
                {Object.entries(resources).map(([resourceName, amount]) => (<ResourceContainer key={Math.random()} resourceName={resourceName} amount={amount}/>))}
            </div>
            { 
                selected && 
                <div>
                    {selected.name}
                    <div style={{display: 'flex', boxSizing: 'border-box', flexWrap: 'wrap'}}>
                        {first(entityState.selectedUnits).actionDefinitions?.map((definition) => {
                            // console.log(definition.action);
                            return (                    
                                definition.action.ButtonComponent({
                                    entity: first(entityState.selectedUnits),
                                    action: definition.action,
                                    entityReducer
                                })
                            )
                        })}
                   </div>
                </div>
            }
        </div>
    );
}