import { ViewGeometry, ViewRotation, TileGeometry } from "../constants/viewport"
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

const calcNewViewportWorldPosition = (currentPosition, viewportVelocity, delta) => {
    const xViewportDistance = viewportVelocity[0] * delta;
    const yViewportDistance = viewportVelocity[1] * delta;
    const zViewportDistance = 0;

    const xWorldDistance = xViewportDistance;
    const yWorldDistance = Math.cos(ViewRotation[0]) * yViewportDistance;
    const zWorldDistance = Math.sin(ViewRotation[0]) * yViewportDistance;

    console.log(yViewportDistance, yWorldDistance);

    return [
        currentPosition[0] + xWorldDistance,
        currentPosition[1] + yWorldDistance,
        currentPosition[2] + zWorldDistance
    ] 
}

export {
    getViewportTiles,
    calcNewViewportWorldPosition
}
