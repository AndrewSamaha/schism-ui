import React from 'react';
import { ACTION_BUTTON_SIZE } from '../../../constants/statusMenuSizes';
import { SELECT_ACTION } from '../../../reducers/entityReducer';

export const ActionButton = ({icon, icon_hover},{entity, action, entityReducer}) => {
    const isSelected = entity.selectedAction === action;
    const border = isSelected ? 'dashed red' : 'none';
    // if (isSelected) console.log('rendering Action button ', entity.selectedAction.longName)
    return (
        <div>
            <img
                src={isSelected ? icon_hover : icon}
                onMouseEnter={e => e.currentTarget.src = icon_hover}
                onMouseLeave={e => e.currentTarget.src = icon}
                onClick={() => {
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
        </div>
    )
}