import React, { useState, useEffect } from 'react';
import { TileChunk } from '../../../lib/TileChunk/TileChunk';
export const ChunkManager = ({gameReducer, userReducer, worldStateQuery}) => {
  return (
  <group>
    {/* {viewportTiles && viewportTiles.map((xColumn, x) => {
      return xColumn.map((tile, y) => {
        return (<Tile key={`${x}-${y}`} position={[x,y,0]} src={tile.src} />)
      })
    })} */}
    {
      tilesInView?.length && tilesInView.map(([key, tile]) => {
        //console.log('boop',tile.x, tile.y);
        return (<Tile key={`x${tile.x}y${tile.y}`} position={[tile.x, tile.y, 0]} src={tile.src} />)
      })
    }
    {/* {
      gameState?.tilesFromServer && Object.entries(gameState?.tilesFromServer).map(([key,tile]) => {
        console.log('boop',tile);
        return (<Tile key={`x${tile.x}y${tile.y}`} position={[tile.x, tile.y, 0]} src={tile.src} />)
      })
    } */}
  </group>
  );
}

ViewportTiles.propTypes = { };

ViewportTiles.defaultProps = { };
