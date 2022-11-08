import { genericGenerator } from "./genericGenerator";
import towerModel from "../stories/assets/models/buildings/tower.1/tower.1.glb";
import { Tower1 } from "../stories/atoms/Tower1/Tower3Baked";

export const tower = {
    name: 'tower',
    longName: 'This is a tower.',
    speed: 0,
    actionDefinitions: [],
    defaultAction: null,
    selectedAction: null,
    component: Tower1,
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