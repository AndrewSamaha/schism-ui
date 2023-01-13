import React, { useRef } from 'react';
import { Tooltip } from '@material-ui/core';
import { ACTION_BUTTON_SIZE } from '../../../constants/statusMenuSizes';
import { SELECT_ACTION } from '../../../reducers/entityReducer';

export const ActionButton = ({icon, icon_hover, name},{entity, action, entityReducer}) => {
    const isSelected = entity.selectedAction === action;
    const border = isSelected ? 'dashed red' : 'none';
    // const { ref } = useRef();
    // if (isSelected) console.log('rendering Action button ', entity.selectedAction.longName)
    return (

        
        <Tooltip title={name} key={name} >
            <img
                key={name}
                src={isSelected ? icon_hover : icon}
                data-tip={name}
                onMouseEnter={e => {
                    e.currentTarget.src = icon_hover
                }}
                onMouseLeave={e => {
                    e.currentTarget.src = icon;
                }}
                onClick={() => {
                    console.log('action onclick')
                    const { entityState, entityDispatch } = entityReducer;
                    console.log('selecting action test ', entity, action);
                    //entity.selectedAction = action;
                    entityDispatch({
                        type: SELECT_ACTION,
                        payload: action
                    })
                }}
                style={{
                    width: `${ACTION_BUTTON_SIZE}px`,
                    height: `${ACTION_BUTTON_SIZE}px`,
                    boxSizing: 'border-box',
                    border: border
                }}>
            </img>
        </Tooltip>

    )
}