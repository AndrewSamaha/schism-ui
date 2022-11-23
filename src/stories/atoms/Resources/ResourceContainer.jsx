import React from 'react';
import times from 'lodash/times';
import { Gold } from './Gold/Gold';

export const ResourceContainer = ({resourceName, amount}) => {
    const resourceArray = times(amount, () => {
        if (resourceName === 'gold') return (<Gold key={Math.random()} />);
        return null;
    })

    // console.log(resourceName,amount,resourceArray);
    return (
        <div className='ResourceContainer' key={Math.random()} style={{display: 'flex', boxSizing: 'border-box', flexWrap: 'wrap'}} >
            {resourceName}: {amount} {amount && (resourceArray)}
        </div>
    );
}