import React, { useState, useReducer, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import './ViewportTiles.css';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { Button } from '../../atoms/Button/Button';
import { userReducer, initialState } from '../../../contexts/UserContext';
import { TileGeometry, ViewGeometry } from '../../../constants/viewport';
import { Tile } from '../../atoms/Tile/Tile';
// import { GameContext, gameReducer } from '../../../contexts/GameContext';
// import { createClientGameState } from '../../../mock/gameState';

export const ViewportTiles = ({gameReducer, userReducer}) => {
  const { gameState, gameDispatch } = gameReducer;
  const { userState, userDispatch } = userReducer;
  const [state, dispatch] = useReducer(userReducer, initialState);
  // const [gameState, gameDispatch] = useReducer(gameReducer, {}, createClientGameState);
  const [viewOffset, setViewOffset] = useState('');
  const [worldLocation, setWorldLocation] = useState('');
  const tileArray = [];
  const width = ViewGeometry[0];
  const height = ViewGeometry[1];
  const xCenterOffset = width / 2;
  const yCenterOffset = height / 2;
  for (let x=0;x<width;x++) {
    for (let y=0;y<height;y++) {
      tileArray.push([
        x-xCenterOffset+TileGeometry[0]/2,
        y-yCenterOffset+TileGeometry[1]/2]);
    }
  }
  console.log('viewportTiles.render');
  console.log({gameState});
  console.log({userState});
  console.log({state});
  return (
  <group>
    {tileArray.map(([x,y]) => <Tile key={`${x}-${y}`} position={[x,y,0]} />)}
  </group>
  );
}

ViewportTiles.propTypes = { };

ViewportTiles.defaultProps = { };
