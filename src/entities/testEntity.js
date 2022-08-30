import { STRAIGHT_LINE_MOVE } from "../actions/straightLineMove";
import { genericGenerator } from "./genericGenerator";

export const testEntity = {
    name: 'testEntity',
    longName: 'This is a test entity.',
    speed: 1.5,
    actions: [
        STRAIGHT_LINE_MOVE
    ],
    newActions: [
        {
            action: STRAIGHT_LINE_MOVE,
            
        }
        
    ],
    defaultAction: STRAIGHT_LINE_MOVE,
    generate: function(params) {
        return genericGenerator(this, params)
    }
};