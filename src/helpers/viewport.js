import { ViewGeometry, TileGeometry } from "../constants/viewport"
const getViewportTiles = ({viewportWorldLocation, tiles}) => {
    // console.log('getViewportTiles');
    // console.log({viewportWorldLocation});
    // console.log({tiles});
    const viewportTiles = [];
    for (let x=0; 
        x<ViewGeometry[0] && x+viewportWorldLocation[0]<tiles.length; 
        x++) {
            viewportTiles[x] = [];
            for (let y=0;
                y<ViewGeometry[1] && y+viewportWorldLocation[1]<tiles[x].length;
                y++) {
                    viewportTiles[x][y] = tiles[x + viewportWorldLocation[0]][y+viewportWorldLocation[1]];
                }
        }
    return viewportTiles;
}

export {
    getViewportTiles
}
