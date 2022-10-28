import { v4 as uuid }from 'uuid';
import { set } from 'lodash/set';

const applyChangesToEntityState = (state, changes) => 
    changes.forEach((change) => set(state, change.path, change.value));

const actionEffect = (args) => {
    /*
        - First call, 
            args:
                changes - array of objects containing path (e.g., a lodash/set path) and value
                sourceEntity - reference to the sourceEntity
                targetEntity - reference to the targetEntity
                actionDetails - an object containiner action.longName and maybe other things
            returns:
                a parent actionEffect object with these fields:
                    id (a uuid)
                    parent: null (null indicates this is a parent)
                    startTime: the time the actionEffect was created
                    sourceEntity + sourceEntityJSON + sourceEntityId
                    targetEntity + targetEntityJSON + targetEntityId
                    actionDetails
                    changeLog: an array of objects containiner time, timeDelta (the time since
                               the start of the actionEffect), and the changes since the last
                               actionEffect
                    applyAll: a function that applies all the changes in the change log to a
                                target entity
        - Second call,
            args:
                parent: the parent actionEffect
                changes: an array of path and value fields since the last changeEffect
        
    */
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
        id: 1,
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

export {
    actionEffect
}
