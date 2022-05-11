const applyFriction = (velocity, friction) => {
    if (Math.abs(velocity) > friction) return velocity * (1-friction)
    else return 0
}

export {
    applyFriction
}