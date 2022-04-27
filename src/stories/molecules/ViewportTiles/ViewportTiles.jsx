import React, { useState, useReducer, useContext, useEffect } from 'react';
// import keydown from 'react-keydown';
import { gql, useMutation } from '@apollo/client';
import './ViewportTiles.css';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { Button } from '../../atoms/Button/Button';
import { userReducer, initialState } from '../../../contexts/UserContext';
import { TileGeometry, ViewGeometry } from '../../../constants/viewport';
import { Tile } from '../../atoms/Tile/Tile';
import { getViewportTiles } from '../../../helpers/viewport';

// class KeyboardWrapper extends React.Component {
//   @keydown('a', 's', 'd', 'w')
//   moveKey( event ) {
//     console.log(event.which);
//   }
// }

export const ViewportTiles = ({gameReducer, userReducer}) => {
  const [viewportTiles, setViewportTiles] = useState(null);
  const { gameState, gameDispatch } = gameReducer;
  const { userState, userDispatch } = userReducer;
  const {viewportWorldLocation} = userState;
  const { tiles } = gameState;
  
  useEffect(() => {
    const newViewportTiles = getViewportTiles({ viewportWorldLocation, tiles });
    setViewportTiles(newViewportTiles);
    console.log(newViewportTiles);
  },[]);
  
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
