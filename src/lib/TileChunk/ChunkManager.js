import { Image } from 'image-js';
import { CHUNK_AREA, CHUNK_SIZE, TILE_SIZE } from '../../constants/tileChunks';
import { TileChunk } from './TileChunk';

class ChunkManager {
    chunkList = [];
    chunkDict = {};
    constructor() {
    }

    updateTile(tile) {
        // figure out what chunk the tile should belong to
        // get that chunk's key
        // see if it's in chunkDict
        // if yes, call updateTile on that chunk
        // if not, create a new chunk and add that tile 
        //   -- it might be cool to add a tile parameter to the chunk constructor
        //   -- it might also be good to pass the ChunkManager to the constructor
    }
}