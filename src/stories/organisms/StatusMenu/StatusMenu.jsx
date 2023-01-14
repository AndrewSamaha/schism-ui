import React, { useEffect, useMemo } from 'react';
import first from 'lodash/first';
import compact from 'lodash/compact';
import backgroundImage from "../../assets/ui/StatusMenu/background.png";
// Components
import { Gold } from '../../atoms/Resources/Gold/Gold';
// Constants
import { STATUSMENU_ZINDEX } from '../../../constants/zIndex';
import { ResourceContainer } from '../../atoms/Resources/ResourceContainer';

export const StatusMenu = ({userState, gameState, performance, entityReducer}) => {
    const { viewportWorldLocation, resources } = userState;
    const { entityState, entityDispatch } = entityReducer;

    const selected = useMemo(() => {
        return compact(entityState.selectedUnits)[0]
    }, [entityState, compact(entityState.selectedUnits)[0]]);

    const actionButtons = useMemo(() => {
        if (!selected || !selected.actionDefinitions) 
            return (<div>No actions available.</div>);
        console.log('calculating actionButtons for selected=', selected)
        return (<div>
                    {selected.name}
                    <div style={{display: 'flex', boxSizing: 'border-box', flexWrap: 'wrap'}}>
                        {selected.actionDefinitions.map((definition, idx) => {
                            // return (<div key={idx}>{definition.action.name}</div>)
                            return (                    
                                definition.action.ButtonComponent({
                                    entity: selected,
                                    action: definition.action,
                                    entityReducer
                                })
                            )
                        })}
                    </div>
                </div>);
    }, [selected]);
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
            {actionButtons}
        </div>
    );
}