import React, { useState, useReducer, useContext, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
// import keydown from 'react-keydown';
import { gql, useMutation } from '@apollo/client';
import './ViewportTiles.css';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { Button } from '../../atoms/Button/Button';
import { userReducer, initialState } from '../../../contexts/UserContext';
import { TileGeometry, ViewGeometry, ViewMoveFriction } from '../../../constants/viewport';
import { Tile } from '../../atoms/Tile/Tile';
import { getViewportTiles } from '../../../helpers/viewport';
import { applyFriction } from '../../../helpers/physics';

// class KeyboardWrapper extends React.Component {
//   @keydown('a', 's', 'd', 'w')
//   moveKey( event ) {
//     console.log(event.which);
//   }
// }
const physicsTic = (delta, state) => {
  if (!state.viewportVelocity) return state;
  
  state.viewportVelocity[0] = applyFriction(state.viewportVelocity[0], ViewMoveFriction);
  state.viewportVelocity[1] = applyFriction(state.viewportVelocity[1], ViewMoveFriction);
  
  if (state.viewportVelocity[0]) state.viewportWorldLocation[0] += state.viewportVelocity[0] * delta;
  if (state.viewportVelocity[1]) state.viewportWorldLocation[1] += state.viewportVelocity[1] * delta;

  return {
    ...state
  };
}

export const ViewportTiles = ({gameReducer, userReducer}) => {
  const [viewportTiles, setViewportTiles] = useState(null);
  const { gameState, gameDispatch } = gameReducer;
  const { userState, userDispatch } = userReducer;
  const {viewportWorldLocation} = userState;
  const { tiles } = gameState;
  
  useEffect(() => {
    const newViewportTiles = getViewportTiles({ viewportWorldLocation, tiles });
    setViewportTiles(newViewportTiles);
    // console.log(newViewportTiles);
  },[]);

  useFrame((state, delta) => {
      const { userInput } = userState;
      if (Object.entries(userInput).length > 0) {
        const push = [0,0];
        const pushSpeed = 2;
        if ('a' in userInput) push[0] += pushSpeed;
        if ('w' in userInput) push[1] -= pushSpeed;
        if ('s' in userInput) push[1] += pushSpeed;
        if ('d' in userInput) push[0] -= pushSpeed;  

        userState.viewportVelocity[0] += push[0];
        userState.viewportVelocity[1] += push[1];
      }
      


      userDispatch({type: 'PHYSICS_TIC', payload: physicsTic(delta, userState)})
      console.log(userState.userInput, userState.viewportVelocity, userState.viewportWorldLocation)
  });
  
  return (
  <group>
    {viewportTiles && viewportTiles.map((xColumn, x) => {
      return xColumn.map((tile, y) => {
        return (<Tile key={`${x}-${y}`} position={[x,y,0]} src={tile.src} />)
      })
    })}
  </group>
  );
}

ViewportTiles.propTypes = { };

ViewportTiles.defaultProps = { };
