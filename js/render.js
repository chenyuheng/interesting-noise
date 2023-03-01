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

function Shuffle(tab){
    for(let e = tab.length-1; e > 0; e--){
        let index = Math.round(Math.random()*(e-1)),
            temp  = tab[e];
    
            tab[e] = tab[index];
        tab[index] = temp;
    }
}

function MakePermutation(){
    let P = [];
    for(let i = 0; i < 256; i++){
        P.push(i);
    }
    Shuffle(P);
    for(let i = 0; i < 256; i++){
        P.push(P[i]);
    }

    return P;
}

function GetConstantVector(v){
    //v is the value from the permutation table
    let h = v & 3;
    if(h == 0)
        return new Vector2(1.0, 1.0);
    else if(h == 1)
        return new Vector2(-1.0, 1.0);
    else if(h == 2)
        return new Vector2(-1.0, -1.0);
    else
        return new Vector2(1.0, -1.0);
}

function Fade(t){
    return ((6*t - 15)*t + 10)*t*t*t;
}

function Lerp(t, a1, a2){
    return a1 + t*(a2-a1);
}

function Noise2D(x, y, P){

    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;

    let xf = x-Math.floor(x);
    let yf = y-Math.floor(y);

    let topRight = new Vector2(xf-1.0, yf-1.0);
    let topLeft = new Vector2(xf, yf-1.0);
    let bottomRight = new Vector2(xf-1.0, yf);
    let bottomLeft = new Vector2(xf, yf);

    //Select a value in the array for each of the 4 corners
    let valueTopRight = P[P[X+1]+Y+1];
    let valueTopLeft = P[P[X]+Y+1];
    let valueBottomRight = P[P[X+1]+Y];
    let valueBottomLeft = P[P[X]+Y];

    let dotTopRight = topRight.dot(GetConstantVector(valueTopRight));
    let dotTopLeft = topLeft.dot(GetConstantVector(valueTopLeft));
    let dotBottomRight = bottomRight.dot(GetConstantVector(valueBottomRight));
    let dotBottomLeft = bottomLeft.dot(GetConstantVector(valueBottomLeft));

    let u = Fade(xf);
    let v = Fade(yf);

    return Lerp(u,
                Lerp(v, dotBottomLeft, dotTopLeft),
                Lerp(v, dotBottomRight, dotTopRight)
            );

}

function p(x, y, P) {
    let n = 0.0,
    a = 1.0,
    f = 0.005;
    for(let o = 0; o < 8; o++){
        let v = a*Noise2D(x*f, y*f, P);
        n += v;

        a *= 0.5;
        f *= 2.0;
    }

    n += 1.0;
    n *= 0.5;
    return Math.round(255*n);
}

function p1(x, y) {
    let rgb = p(x, y, P1);
    let n = 0;
    if (rgb > 127) {
        n = 255;
    }
    return [n, n, n, 1];
}

function p2(x, y) {
    let rgb = p(x, y, P1);
    return [rgb, rgb, rgb, 1];
}

function p3(x, y) {
    let r = p(x, y, P1);
    let g = p(x, y, P2);
    let b = p(x, y, P3);
    return [r, g, b, 1];
}

function gradient_color(colors, g) {
    if (g < 0 || g > 255) {
        console.error("g out of range: " + g);
        return 0;
    }
    g = g / 2.55;
    g = Math.round(g);
    gradient_list = [];
    for (i in colors) {
        if (i < 0 || i > 100) {
            console.error("gradient out of range: " + i);
            return 0;
        }
        gradient_list.push(i);
    }
    for (i = 0; i < gradient_list.length - 1; i++) {
        if (g >= gradient_list[i] && g <= gradient_list[i+1]) {
            let begin_gradient = gradient_list[i];
            let end_gradient = gradient_list[i+1];
            let begin_color = colors[begin_gradient];
            let end_color = colors[end_gradient];
            let end_fraction = (g - begin_gradient) / (end_gradient - begin_gradient);
            let begin_fraction = 1 - end_fraction;
            return [
                begin_color[0]*begin_fraction + end_color[0]*end_fraction,
                begin_color[1]*begin_fraction + end_color[1]*end_fraction,
                begin_color[2]*begin_fraction + end_color[2]*end_fraction,
                begin_color[3]*begin_fraction + end_color[3]*end_fraction,
            ];
        }
    }
    console.error("generate gradient color fail")
    return 0;
}


let cloudy_sky_colors = {
    0: [135, 206, 235, 1],
    50: [135, 206, 235, 1],
    100: [255, 255, 255, 1]
}

function cloudy_sky(x, y) {
    let g = p(x, y, P1);
    return gradient_color(cloudy_sky_colors, g);
}


let earth_colors = {
    0: [50, 90, 147, 1],
    40: [67, 127, 187, 1],
    50: [151, 214, 241, 1],
    51: [12, 116, 53, 1],
    70: [229, 208, 120, 1],
    89: [105, 81, 69, 1],
    90: [220, 219, 218, 1],
    100: [255, 255, 255, 1]
}

function earth(x, y) {
    let g = p(x, y, P1);
    return gradient_color(earth_colors, g);
}


let magma_colors = {
    0: [178, 21, 0, 1],
    50: [237, 122, 0, 1],
    100: [232, 243, 207, 1]
}

function magma(x, y) {
    let g = p(x, y, P1);
    return gradient_color(magma_colors, g);
}