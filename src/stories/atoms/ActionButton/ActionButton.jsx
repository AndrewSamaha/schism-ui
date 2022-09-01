import React from 'react';
import { ACTION_BUTTON_SIZE } from '../../../constants/statusMenuSizes';

export const ActionButton = ({icon, icon_hover}) => {
    return (
        <div>
            <img
                src={icon}
                onMouseEnter={e => e.currentTarget.src = icon_hover}
                onMouseLeave={e => e.currentTarget.src = icon}
                style={{
                width: `${ACTION_BUTTON_SIZE}px`,
                height: `${ACTION_BUTTON_SIZE}px`,
                boxSizing: 'border-box'}}>
            </img>
        </div>
    )
}