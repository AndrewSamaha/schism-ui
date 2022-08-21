import * as THREE from 'three';

const getAngleDist = (start, end) => {
    let start2D;
    if (Array.isArray(start)) {
        start2D = new THREE.Vector2(start[0], start[1])
    } else {
        start2D = new THREE.Vector2(start.x, start.y);
    }
    const end2D = new THREE.Vector2(end.x, end.y);
    const vector = end2D.sub(start2D);
    const angle = vector.angle();
    const dist = vector.length();
    return { angle, dist };
};

export {
    getAngleDist
}