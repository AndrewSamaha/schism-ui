import React, { useReducer, useContext, useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stats } from '@react-three/drei';
import { ViewRotation } from '../../../constants/viewport';
import { applyFriction } from '../../../helpers/physics';
import { ViewMoveFriction } from '../../../constants/viewport';

const calcNewViewportWorldPosition = (currentPosition, viewportVelocity, delta) => {
    const xViewportDistance = viewportVelocity[0] * delta;
    const yViewportDistance = viewportVelocity[1] * delta;

    const xWorldDistance = xViewportDistance;
    const yWorldDistance = yViewportDistance;
    const zWorldDistance = yViewportDistance;

    return {
        x: currentPosition.x + xWorldDistance,
        y: currentPosition.y + yWorldDistance,
        z: currentPosition.z + zWorldDistance
    }
}

const physicsTicRef = (delta, userInput, current) => {
    const { position: currentPosition, velocity: currentVelocity } = current;
    if (!currentVelocity) return { velocity: currentVelocity, position: currentPosition }
    if (!currentVelocity[0] && !currentVelocity[1] && !currentVelocity[2]) return { velocity: currentVelocity, position: currentPosition }

    const newPosition = calcNewViewportWorldPosition( currentPosition, currentVelocity, delta )
    return { 
        velocity: [ applyFriction(currentVelocity[0], ViewMoveFriction), applyFriction(currentVelocity[1], ViewMoveFriction) ],
        position: newPosition
    };
}

function keysReducer(state, action) {
    const { payload, type } = action;
    switch (type) {
        case 'keydown':
            if (state.includes(payload)) return state;
            return `${state}${payload}`;
        case 'keyup':
            return state.replace(payload, '');
        default:
            return state;
    }
}

export const Camera = (props) => {
    const { startingPosition, userReducer, gameDispatch } = props;
    const { userState } = userReducer;
    const { userInput } = userState;

    const [keysDown, keysDispatch] = useReducer(keysReducer, '');
    const ref = useRef();
    
    useEffect(() => {
        gameDispatch({type: 'REGISTER_CAMERA', payload: {ref, keysDown, keysDispatch}})
        if (startingPosition) {
            ref.current.position.x = startingPosition[0];
            ref.current.position.y = startingPosition[1];
            ref.current.position.z = startingPosition[2];
            ref.history = [];
            ref.current.velocity = [0,0,0];
        }
    }, [])

    useFrame((state, delta) => {
        //console.log(keysDown)
        if (keysDown.length) {
            
            const push = [0,0];
            const pushSpeed = 2;
            if (keysDown.includes('a')) push[0] -= pushSpeed;
            if (keysDown.includes('w')) push[1] += pushSpeed;
            if (keysDown.includes('s')) push[1] -= pushSpeed;
            if (keysDown.includes('d')) push[0] += pushSpeed;  
    
            if (ref.current == null) {
                console.log('creating camera ref.current')
                ref.current = {};
            }
            if (ref.current?.velocity == null) {
                console.log('creating camera ref.current.velocity')
                ref.current.velocity = [0,0,0];
                ref.current.position.x = startingPosition[0];
                ref.current.position.y = startingPosition[1];
            }
            
            ref.current.velocity[0] += push[0];
            ref.current.velocity[1] += push[1];
        }
        
        const { velocity, position } = physicsTicRef(delta, userInput, ref.current);
    
        ref.current.velocity = velocity;
        ref.current.position.x = position.x;
        ref.current.position.y = position.y;
        
        ref.history.push({
            t: Date.now(),
            position,
            velocity
        });
        const HISTORY_SIZE = 120;
        if (ref.history.length > HISTORY_SIZE) ref.history.splice(HISTORY_SIZE, ref.history.length - HISTORY_SIZE)

        // if (velocity[0] > 0  || velocity[1] > 0) gameDispatch({ type: 'SET_NEW_CAMERA_POSITION', payload: position })
    })

    return (
        <PerspectiveCamera 
            makeDefault 
            fov={20}
            ref={ref}
            rotation={ViewRotation} >
                
                <ambientLight intensity={.5} />

        </PerspectiveCamera>
    )
}
