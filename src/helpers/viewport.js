import { ViewGeometry, ViewRotation, TileGeometry } from "../constants/viewport"

const getViewportTiles = ({viewportWorldLocation, tiles}) => {
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

const calcNewViewportWorldPosition = (currentPosition, viewportVelocity, delta) => {
    const xViewportDistance = viewportVelocity[0] * delta;
    const yViewportDistance = viewportVelocity[1] * delta;

    const xWorldDistance = xViewportDistance;
    const yWorldDistance = yViewportDistance; // Math.cos(ViewRotation[0]) *
    const zWorldDistance = yViewportDistance; // Math.sin(ViewRotation[0]) *

    return [
        currentPosition[0] + xWorldDistance,
        currentPosition[1] + yWorldDistance,
        currentPosition[2] /* + zWorldDistance */
    ] 
}

export {
    getViewportTiles,
    calcNewViewportWorldPosition
}
