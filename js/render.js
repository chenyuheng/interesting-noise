function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function random_black_white(x, y) {
    let n = getRandomInt(2) * 255;
    return [n, n, n, 1];
}

function random_gray(x, y) {
    let n = getRandomInt(255);
    return [n, n, n, 1];
}

function random_color(x, y) {
    return [getRandomInt(255), getRandomInt(255), getRandomInt(255), 1];
}

const const_random = [
    [-151,-160,137,91,1],
    [90,15,131,-13,-11],
    [201,-95,12,-53,-122],
    [194,-233,7,225,99],
    [68,175,74,165,71]
];

function get_vec(X, Y) {
    return new Vector2(const_random[X][Y], const_random[Y][X]);
}

function continuous_rgba(x, y) {
    let X = Math.floor(x / 64);
    let Y = Math.floor(y / 64);
    x %= 64;
    y %= 64;
    let const_vecs = [];
    const_vecs.push(get_vec(X, Y));
    const_vecs.push(get_vec(X + 1, Y));
    const_vecs.push(get_vec(X, Y + 1));
    const_vecs.push(get_vec(X + 1, Y + 1));
    for (let i = 0; i < const_vecs.length; i++) {
        const_vecs[i].normalize();
    }
    let vari_vecs = [];
    vari_vecs.push(new Vector2(0 - x, 0 - y));
    vari_vecs.push(new Vector2(64 - x, 0 - y));
    vari_vecs.push(new Vector2(0 - x, 64 - y));
    vari_vecs.push(new Vector2(64 - x, 64 - y));
    for (let i = 0; i < vari_vecs.length; i++) {
        vari_vecs[i].normalize();
    }
    let rgba = [];
    for (let i = 0; i < 4; i++) {
        let n = vari_vecs[i].dot(const_vecs[i]);
        n = (n + 1) * 256 / 2 ;
        rgba.push(n);
    }
    return rgba;
}

function continuous_black_white(x, y) {
    let color = continuous_rgba(x, y);
    let mix = (color[0] +  color[1] +  color[2] +  color[3]) / 4;
    color[0] = mix > 128 ? 255 : 0;
    color[1] = color[0];
    color[2] = color[0];
    color[3] = 1;
    return color;
}

function continuous_gray(x, y) {
    let color = continuous_rgba(x, y);
    let mix = (color[0] +  color[1] +  color[2] +  color[3]) / 4;
    color[0] = mix;
    color[1] = mix;
    color[2] = mix;
    color[3] = 1;
    return color;
}

function continuous_color(x, y) {
    let color = continuous_rgba(x, y);
    color[3] = 1;
    return color;
}