import { colorArray } from "../constants/colors";

const randColor = (not = ['not']) => {
    if (!Array.isArray(not)) {
        not = [not];
    }
    let color = not[0];
    while (not.includes(color)) {
        color = colorArray[Math.floor(colorArray.length * Math.random())];
    }
    return color;
};

export {
    randColor
}
