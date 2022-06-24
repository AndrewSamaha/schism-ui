import { ViewMaxGeometry } from '../constants/viewport';
import { tileTextures } from '../constants/tiles';


const createTile = ({ typeIndex, worldPosition }) => {
    return {
        typeIndex,
        ...tileTextures[typeIndex],
        worldPosition
    }
}

const generateMockTileArray = () => {
    console.log('viewMaxGeometry xy=',ViewMaxGeometry[0],ViewMaxGeometry[1]);
    const mockTiles=[];
    for (let x=0; x<ViewMaxGeometry[0]; x++) {
        mockTiles[x] = [];
        for (let y=0; y<ViewMaxGeometry[1]; y++) {
            mockTiles[x][y] = createTile({
                typeIndex: Math.floor(Math.random() * tileTextures.length),
                worldPosition: [x, y]
            })
        }
    }
    return mockTiles;
}

const createClientGameState = (useMocks=false) => {
    const tiles = useMocks ? generateMockTileArray() : [];
    // console.log({f: 'createClientGameState', tileLength: tiles.length, useMocks})
    return {
        lastTic: Date.now(),
        actions: [],
        tiles,
        units: []
    }
}

export {
    createClientGameState
}