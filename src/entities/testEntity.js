import { STRAIGHT_LINE_MOVE } from "../actions/straightLineMove";
import { CREATE_ENTITY } from "../actions/createEntity";
import { genericGenerator } from "./genericGenerator";
import { CREATE_TOWER } from "../actions/createTower";
import { CREATE_BASE } from "../actions/createBase";

export const testEntity = {
    gltfPath: '/assets/character/TestHuman/TestHuman.gltf',
    materialMap: (nodeName) => {
        switch (nodeName) {
            case 'Cube':
            default:
                return 'Material'
        }
    },
    name: 'testEntity',
    longName: 'This is a test entity.',
    speed: 1.5,
    actionDefinitions: [
        {
            action: STRAIGHT_LINE_MOVE,
            shortcutKey: 'm',
        }, {
            action: CREATE_BASE,
            shortcutKey: 'b'
        }, {
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