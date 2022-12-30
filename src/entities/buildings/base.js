import { genericGenerator } from "../genericGenerator";
import { CREATE_ENTITY } from "../../actions/createEntity";

export const base = {
    name: 'base',
    longName: 'This is a base.',
    speed: 0,
    sightRange: 8,
    actionDefinitions: [
        {
            action: CREATE_ENTITY,
            shortcutKey: 'c'
        }
    ],
    defaultAction: null,
    selectedAction: null,
    scale: 2.0,
    rotation: [3.14/2, 0, 0],
    // gltfPath: '/basebb.gltf',
    materialMap: (nodeName) => {
        return '';
    },
    fiberModelPath: '/basebb.gltf',
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