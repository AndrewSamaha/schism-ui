import { uuid } from 'uuid';
import { set } from 'lodash/set';

const applyChangesToEntityState = (state, changes) => 
    changes.forEach((change) => set(state, change.path, change.value));

const actionEffect = (args) => {
    const { parent, changes } = args;

    if (parent) {
        const { changeLog, startTime } = parent;
        changeLog.push({
            timeDelta: Date.now() - startTime,
            time: Date.now(),
            changes
        });
        return parent;
    }

    const { sourceEntity, targetEntity, actionDetails } = args;
    const startTime = Date.now();
    const changeLog = [ {
        timeDelta: 0,
        time: startTime,
        changes
    } ];
    return {
        id: uuid(),
        parent: null,
        startTime,
        sourceEntity,
        sourceEntityJSON: JSON.stringify(sourceEntity),
        targetEntity,
        targetEntityJSON: JSON.stringify(targetEntity),
        sourceEntityId: sourceEntity.id,
        targetEntityId: targetEntity.id,
        actionDetails,
        changeLog,
        applyAll: (target) => changeLog.forEach(({changes}) => applyChangesToEntityState(target, changes))
    }
}

const entityMutationRequest = (args) => {
    const { sourceEntityId, targetEntityId, actionDetails, changes } = args;
    const startTime = Date.now();

}