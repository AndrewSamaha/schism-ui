import { testEntity } from "../entityTypes/entities/testEntity";

export const CREATE_TEST_ENTITY = {
    name: 'Test Entity',
    longName: 'Create Test Entity',
    meetsRequirements: function(inputEventState) {
        return true;
    },
    buildParams: {
        cost: { gold: 5 },
        time: 30,
        result: testEntity
    }
}