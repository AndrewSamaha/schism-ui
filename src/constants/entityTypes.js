import { straightLineMoveGenerator } from "../entities/actions"

const STRAIGHT_LINE_MOVE = {
    name: 'Move',
    generator: straightLineMoveGenerator
};

const testEntity = {
    name: 'testEntity',
    actions: [
        STRAIGHT_LINE_MOVE
    ],
    defaultAction: STRAIGHT_LINE_MOVE
};

export {
    testEntity
}