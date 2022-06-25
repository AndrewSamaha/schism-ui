import { tileTextures } from "../constants/tiles";

const getTextureSrc = (type) => {
    const matches = tileTextures.filter(texture => {
        // console.log(texture.type, type)
        if (texture.type === type) return true;
        return false;
    });
    //console.log('matches', matches);//[0].src;
    if (!matches.length) {
        console.log('no match found for ', type);
        return tileTextures[0].src;
    }
    return matches[0].src;
    // return "none";
}

export {
    getTextureSrc
}