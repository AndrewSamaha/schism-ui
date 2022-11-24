import { STRAIGHT_LINE_MOVE } from "../actions/straightLineMove";
import { CREATE_ENTITY } from "../actions/createEntity";
import { genericGenerator } from "./genericGenerator";
import { CREATE_TOWER } from "../actions/createTower";

export const testEntity = {
    gltfPath: '/TestHuman.gltf',
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
        }, {
            action: CREATE_TOWER,
            shortcutKey: 't'
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