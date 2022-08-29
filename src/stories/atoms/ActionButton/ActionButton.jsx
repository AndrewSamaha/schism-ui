import React from 'react';
// icons
import moveEntityIcon from '../../assets/ui/Buttons/MoveEntity.png';
import moveEntityIcon_hover from '../../assets/ui/Buttons/MoveEntity_hover.png';

export const ActionButton = ({icon, icon_hover}) => {
    return (
        <div>
            <img
                src={moveEntityIcon}
                onMouseEnter={e => e.currentTarget.src = icon_hover}
                onMouseLeave={e => e.currentTarget.src = icon}
                style={{
                width: '32px',
                height: '32px',
                boxSizing: 'border-box'}}>
            </img>
        </div>
    )
}