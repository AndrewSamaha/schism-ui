import { genericGenerator } from "../genericGenerator";

export const goldMine = {
    name: 'goldMine',
    longName: 'This is a gold mine.',
    resourceType: 'gold',
    resourceRemaining: 100,
    speed: 0,
    sightRange: 8,
    actionDefinitions: [],
    defaultAction: null,
    selectedAction: null,
    scale: .15,
    fiberModelPath: '/assets/resources/gold/resourceGold.gltf',
    materialMap: (nodeName) => { return ''; },
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