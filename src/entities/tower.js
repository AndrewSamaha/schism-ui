import { genericGenerator } from "./genericGenerator";

export const tower = {
    name: 'tower',
    longName: 'This is a tower.',
    speed: 0,
    actionDefinitions: [],
    defaultAction: null,
    selectedAction: null,
    scale: .15,
    gltfPath: '/Tower3Baked.gltf',
    materialMap: (nodeName) => {
        switch (nodeName) {
            case 'Cylinder002':    return 'Material.003';
            case 'Cylinder002_1':  return 'Material.002';
            case 'Cylinder002_2':  
            default:               return 'Material.001';
        }
    },
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