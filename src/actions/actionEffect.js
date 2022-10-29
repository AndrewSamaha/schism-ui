import { v4 as uuid }from 'uuid';
import set from 'lodash/set';

const applyChangesToEntityState = (target, changes) => {
    // console.log('applyChangesToEntityState changes.length', changes)
    changes.forEach(({path, value}) => {
        // console.log(' ',path,value)
        set(target, path, value)
    })
};

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
    const { parentEffect, changes } = args;

    if (parentEffect) {
        const { changeLog, startTime } = parentEffect;
        changeLog.push({
            timeDelta: Date.now() - startTime,
            time: Date.now(),
            changes
        });
        return parentEffect;
    }
    
    const { sourceEntity, targetEntity, actionStrings } = args;
    const startTime = Date.now();
    const changeLog = [ {
        timeDelta: 0,
        time: startTime,
        changes
    } ];
    const dataObj = {
        id: uuid(),
        startTime,
        sourceEntity,
        sourceEntityJSON: JSON.stringify(sourceEntity),
        targetEntity,
        targetEntityJSON: JSON.stringify(targetEntity),
        sourceEntityId: sourceEntity.id,
        targetEntityId: targetEntity.id,
        actionStrings,
        changeLog
    }
    const functions = {
        applyAll: function(target) {
            changeLog.forEach(({changes}) => applyChangesToEntityState(target, changes))
            return this;
        },
        apply: function(target) {
            if (!changeLog || !changeLog.length) {
                console.log('apply bailing out changeLog=', changeLog)
                return this;
            }
            const changeLogEntry = changeLog[changeLog.length - 1];
            const { changes } = changeLogEntry;
            
            if (target) {
                applyChangesToEntityState(target, changes)
                return this;
            }
            applyChangesToEntityState(this.targetEntity, changes)
            return this;
        },
        status: function() {
            console.log('actionDetails', dataObj.actionStrings)
            console.log('uuid', dataObj.id)
            console.log('total tics:', changeLog.length);
            const changeLogEntry = changeLog[changeLog.length - 1];
            const { timeDelta } = changeLogEntry;
            console.log('total time', timeDelta);
            return this;
        }
    }
    return {
        ...dataObj,
        ...functions
    }
}

export {
    actionEffect
}
