import React, { useReducer, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CameraHelper } from 'three';
import { PerspectiveCamera, OrthographicCamera, useHelper } from '@react-three/drei';
import { ViewRotation } from '../../../constants/viewport';
import { applyFriction } from '../../../helpers/physics';
import { ViewMoveFriction } from '../../../constants/viewport';
import { FOV, ASPECT, ZOOM, ROTATION } from '../../../constants/camera';
import { CHUNK_SIZE } from '../../../constants/tileChunks';

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

const getFrustrum = (ref) => {
    if (!ref?.current?.position) return {};

    const {x, y} = ref?.current?.position;
    const z = 0.51;

    const center = [x, y+50, z];
    const widthRadius = 15; // 9
    const heightRadius = 8;
    const topWidthAdjustment = 2;
    const widthInChunks = Math.ceil((widthRadius + topWidthAdjustment) * 2 / CHUNK_SIZE);
    const heightInChunks = Math.ceil((heightRadius * 3) / CHUNK_SIZE)

    const worldAddresses = {
        topLeft:     [ center[0] - widthRadius - topWidthAdjustment, center[1] + heightRadius, center[2] ],
        topRight:    [ center[0] + widthRadius + topWidthAdjustment, center[1] + heightRadius, center[2] ],
        bottomLeft:  [ center[0] - widthRadius, center[1] - heightRadius, center[2] ],
        bottomRight: [ center[0] + widthRadius, center[1] - heightRadius, center[2] ],
        center
    };


    const worldDimensions = {
        worldWidth: worldAddresses.topRight[0] - worldAddresses.topLeft[0],
        worldHeight: worldAddresses.topRight[1] - worldAddresses.bottomRight[1]
    }

    const topLeftChunk = [
        Math.floor(worldAddresses.topLeft[0] / CHUNK_SIZE) * CHUNK_SIZE,
        Math.floor(worldAddresses.topLeft[1] / CHUNK_SIZE) * CHUNK_SIZE
    ];
    
    const chunkFrustrum = {
        widthInChunks,
        heightInChunks,
        topLeftChunk: [
            Math.floor(worldAddresses.topLeft[0] / CHUNK_SIZE) * CHUNK_SIZE,
            Math.floor(worldAddresses.topLeft[1] / CHUNK_SIZE) * CHUNK_SIZE
        ],
        bottomRightChunk: [
            Math.floor(worldAddresses.topRight[0] / CHUNK_SIZE) * CHUNK_SIZE,
            Math.floor(worldAddresses.bottomRight[1] / CHUNK_SIZE) * CHUNK_SIZE
        ]
    }

    const visibleChunks = (()=> {
        const chunks = [];
        // console.log('chunks')
        for (let x = topLeftChunk[0]; x < topLeftChunk[0] + widthInChunks * CHUNK_SIZE; x+=CHUNK_SIZE) {
            for (let y = topLeftChunk[1]; y > topLeftChunk[1] - heightInChunks * CHUNK_SIZE; y-=CHUNK_SIZE) {
                chunks.push({x, y})
            }
        }
        return chunks;
    })()

    //const visibleChunks:
    // console.log('new frustrum', widthInChunks*heightInChunks, visibleChunks)
    return {
        ...worldAddresses,
        ...worldDimensions,
        topLeftChunk,
        visibleChunks
    };
}

export const Camera = (props) => {
    const { startingPosition, userReducer, gameDispatch } = props;
    const { userState } = userReducer;
    const { userInput } = userState;

    const [keysDown, keysDispatch] = useReducer(keysReducer, '');
    const ref = useRef();
    
    useHelper(ref, CameraHelper, 1, 'hotpink');

    useLayoutEffect(() => {
        gameDispatch({type: 'REGISTER_CAMERA', payload: {ref, keysDown, keysDispatch}})
        if (startingPosition) {
            ref.current.position.x = startingPosition[0];
            ref.current.position.y = startingPosition[1];
            ref.current.position.z = startingPosition[2];
            ref.history = [];
            ref.current.velocity = [0,0,0];
        }
    },[])

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
                //console.log('creating camera ref.current')
                ref.current = {};
            }
            if (ref.current?.velocity == null) {
                //console.log('creating camera ref.current.velocity')
                ref.current.velocity = [0,0,0];
                ref.current.position.x = startingPosition[0];
                ref.current.position.y = startingPosition[1];
            }
            
            ref.current.velocity[0] += push[0];
            ref.current.velocity[1] += push[1];
        }
        
        const { velocity, position } = physicsTicRef(delta, userInput, ref.current);
        if (!ref.frustrum || position.x !== ref.current.position.x || position.y !== ref.current.position.y) {
            ref.frustrum = getFrustrum(ref);
        }
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
        
    })
    
    

    return (
        <PerspectiveCamera 
            makeDefault 
            fov={FOV}
            aspect={ASPECT}
            ref={ref}
            zoom={ZOOM}
            rotation={ROTATION} >
                
                <ambientLight intensity={.5} />

        </PerspectiveCamera>
    )
}
