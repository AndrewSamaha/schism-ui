import React, { useState, useReducer, useContext, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import './ViewportTiles.css';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { Button } from '../../atoms/Button/Button';
import { userReducer, initialState } from '../../../contexts/UserContext';
import { TileGeometry, ViewGeometry } from '../../../constants/viewport';
import { Tile } from '../../atoms/Tile/Tile';
import { getViewportTiles } from '../../../helpers/viewport';

export const ViewportTiles = ({gameReducer, userReducer}) => {
  const [viewportTiles, setViewportTiles] = useState(null);
  const { gameState, gameDispatch } = gameReducer;
  const { userState, userDispatch } = userReducer;
  const {viewportWorldLocation} = userState;
  const { tiles } = gameState;
  //[playerX, playerY] = userState.viewportWorldLocation;
  useEffect(() => {
    const newViewportTiles = getViewportTiles({ viewportWorldLocation, tiles });
    setViewportTiles(newViewportTiles);
    console.log(newViewportTiles);
  },[]);
  
  // const tileArray = [];
  // const width = ViewGeometry[0];
  // const height = ViewGeometry[1];
  // const xCenterOffset = width / 2;
  // const yCenterOffset = height / 2;
  // for (let x=0;x<width;x++) {
  //   for (let y=0;y<height;y++) {
  //     tileArray.push([
  //       x-xCenterOffset+TileGeometry[0]/2,
  //       y-yCenterOffset+TileGeometry[1]/2]);
  //   }
  // }
  console.log('viewportTiles.render');
  
  console.log({ViewportTiles: viewportTiles});
  return (
  <group>
    {/* {tileArray.map(([x,y]) => <Tile key={`${x}-${y}`} position={[x,y,0]} />)} */}
    {viewportTiles && viewportTiles.map((xColumn, x) => {
      return xColumn.map((tile, y) => {
        // console.log({x,y, tile});
        return (<Tile key={`${x}-${y}`} position={[x,y,0]} src={tile.src} />)
      })
    })}


    {/* {viewportTiles && viewportTiles.map(([x,y]) => <Tile key={`${x}-${y}`} position={[x,y,0]} />)} */}
  </group>
  );
}

ViewportTiles.propTypes = { };

ViewportTiles.defaultProps = { };
