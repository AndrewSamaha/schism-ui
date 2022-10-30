import { STRAIGHT_LINE_MOVE } from "../actions/straightLineMove";
import { CREATE_ENTITY } from "../actions/createEntity";
import { genericGenerator } from "./genericGenerator";

export const testEntity = {
    name: 'testEntity',
    longName: 'This is a test entity.',
    speed: 1.5,
    actionDefinitions: [
        {
            action: STRAIGHT_LINE_MOVE,
            shortcutKey: 'm',
        },{
            action: CREATE_ENTITY,
            shortcutKey: 'c'
        }
    ],
    defaultAction: STRAIGHT_LINE_MOVE,
    selectedAction: null,
    toString: function() {
        const { 
            actionDefinitions,
            defaultAction,
            selectedAction,
            ...slimEntity
        } = this;
        return JSON.stringify(slimEntity);
    },
    generate: function(params) {
        return genericGenerator(this, params)
    }
};