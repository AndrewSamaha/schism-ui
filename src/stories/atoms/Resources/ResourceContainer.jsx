import React from 'react';
import times from 'lodash/times';
import { Gold } from './Gold/Gold';

export const ResourceContainer = ({resourceName, amount}) => {
    const resourceArray = times(amount, () => {
        if (resourceName === 'gold') return (<Gold />);
        return null;
    })

    // console.log(resourceName,amount,resourceArray);
    return (
        <div class='ResourceContainer' style={{display: 'flex', boxSizing: 'border-box', flexWrap: 'wrap'}} >
            {resourceName}: {amount} {amount && (resourceArray)}
        </div>
    );
}