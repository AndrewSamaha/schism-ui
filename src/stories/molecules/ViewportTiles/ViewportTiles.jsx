import React, { useState, useReducer } from 'react';
import { gql, useMutation } from '@apollo/client';
import './ViewportTiles.css';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { Button } from '../../atoms/Button/Button';
import { userReducer, initialState } from '../../../contexts/UserContext';
import { Tile } from '../../atoms/Tile/Tile';

export const ViewportTiles = () => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [viewOffset, setViewOffset] = useState('');
  const [worldLocation, setWorldLocation] = useState('');
  const tileArray = [];
  const width = 11;
  const height = 11;
  const xCenterOffset = width / 2;
  const yCenterOffset = height / 2;
  for (let x=0;x<width;x++) {
    for (let y=0;y<height;y++) {
      tileArray.push([
        x-xCenterOffset+Tile.defaultProps.geometry[0]/2,
        y-yCenterOffset+Tile.defaultProps.geometry[1]/2]);
    }
  }
  console.log('calc');
  return (
  <group>
    {tileArray.map(([x,y]) => <Tile key={`${x}-${y}`} position={[x,y,0]} />)}
  </group>
  );
}

ViewportTiles.propTypes = { };

ViewportTiles.defaultProps = { };
