import { genericGenerator } from "./genericGenerator"
// Entities
export const testBuilding = {
    name: 'testBuilding',
    longName: 'This is a test building.',
    speed: 0,
    actions: [],
    defaultAction: null,
    generate: function(params) { return genericGenerator(this, params) }
}