import { genericGenerator } from "../genericGenerator";

export const forest = {
    name: 'forest',
    longName: 'This is a forest.',
    resourceType: 'wood',
    resourceRemaining: 100,
    speed: 0,
    sightRange: 8,
    actionDefinitions: [],
    defaultAction: null,
    selectedAction: null,
    scale: .15,
    fiberModelPath: '/assets/resources/wood/resourceWood.gltf',
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