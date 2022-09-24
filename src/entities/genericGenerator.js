import uniqueId from 'lodash/uniqueId';
import { randColor } from '../helpers/colors';

export const genericGenerator = (entityType, params) => {
    const position = [Math.random()*10, Math.random()*10, 0];
    const color = randColor(['gray','darkgray']);
    const entity = {
        ...entityType,
        id: uniqueId('entity-'),
        color,
        position,
        lastTic: Date.now(),
        ...params
    }
    return entity;
};