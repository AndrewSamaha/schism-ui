const limit = (number, min, max) => {
    const inBounds = Math.min(Math.max(number, min), max);
    console.log('limit', number, inBounds, min, max);
    return inBounds;
}

export {
    limit
}