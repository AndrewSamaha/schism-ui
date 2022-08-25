import { colorArray } from "../constants/colors";

const randColor = () => colorArray[Math.floor(colorArray.length * Math.random())];

export {
    randColor
}
