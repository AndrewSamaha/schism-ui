import uniqueId from 'lodash/uniqueId';
import { straightLineMoveGenerator } from "../entities/actions"
import { randColor } from '../helpers/colors';

const STRAIGHT_LINE_MOVE = {
    name: 'Move',
    longName: 'STRAIGHT_LINE_MOVE',
    generator: straightLineMoveGenerator
};

const testEntityGenerator = (params) => {
    const position = [Math.random()*10, Math.random()*10, 0];
    const color = randColor();
    const entity = {
        id: uniqueId('entity-'),
        name: 'testEntity',
        color,
        position,
        lastTic: Date.now(),
        speed: 1.5,
        actions: [
            STRAIGHT_LINE_MOVE
        ],
        defaultAction: STRAIGHT_LINE_MOVE
    }
    return entity;
};

export {
    testEntityGenerator
}