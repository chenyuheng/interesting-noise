function draw(canvas_id, render) {
    let canvas = document.getElementById(canvas_id);
    canvas.width = 256;
    canvas.height = 256;
    let ctx = canvas.getContext("2d");
    for (let x = 0; x < 256; x++) {
        for (let y = 0; y < 256; y++) {
            let color = render(x, y);
            ctx.fillStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
            ctx.fillRect(x, y, x, y);
        }
    }
}

let P1 = MakePermutation();
let P2 = MakePermutation();
let P3 = MakePermutation();
function init() {
    draw("random-black-white", random_black_white);
    draw("random-gray", random_gray);
    draw("random-color", random_color);
    draw("continuous-black-white", continuous_black_white);
    draw("continuous-gray", continuous_gray);
    draw("continuous-color", continuous_color);
    draw("p1", p1);
    draw("p2", p2);
    draw("p3", p3);
    draw("cloudy_sky", cloudy_sky);
    draw("earth", earth);
    draw("magma", magma);
}