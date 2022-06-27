import { Image } from 'image-js';
import { CHUNK_AREA, CHUNK_SIZE, TILE_SIZE } from '../../constants/tileChunks';

const width = CHUNK_SIZE * TILE_SIZE;
const height = CHUNK_SIZE * TILE_SIZE;
const channels = 4;
const rgbaPixel = 0x00000000;

class TileChunk {
    image;
    imageContext;

    worldTopLeftX; // topLeft of image is 0,0
    worldTopLeftY;
    worldTopRightX;
    worldTopRightY;
    worldBottomLeftX;
    worldBottomLeftY;
    worldBottomRightX;
    worldBottomRightY;

    constructor (args) {
        const { worldTopLeftX, worldTopLeftY } = args;

        this.image = document.createElement('canvas');
        this.image.width = width;
        this.image.height = 768;

        // The default <canvas> is transparent, let's make it white
        this.imageContext = this.image.getContext('2d');
        this.imageContext.fillStyle = 'white';
        this.imageContext.fillRect(0, 0, width, height);

        this.worldTopLeftX = worldTopLeftX;
        this.worldTopLeftY = worldTopLeftY;
        this.worldTopRightX = this.worldTopLeftX + width;
        this.worldTopRightY = this.worldTopLeftY;
        this.worldBottomLeftX = this.worldTopLeftX;
        this.worldBottomLeftY = this.worldTopLeftY + height;
        this.worldBottomRightX = this.worldTopRightX;
        this.worldBottomRightY = this.worldBottomLeftY;
    }

    get worldPosition() {
        return {
            x: this.worldTopLeftX,
            y: this.worldTopLeftY
        }
    }

    get key() {
        return 'Cx' + this.worldTopLeftX + 'y' + this.worldTopLeftY;
    }

    isInBounds(x, y) {
        if (x >= this.worldTopLeftX && x <= this.worldTopRightX && y >= this.worldTopLeftY && y <= this.worldBottomLeftY) return true;
        return false;
    }

    updateTile(tile) {

    }
}

export {
    TileChunk

}