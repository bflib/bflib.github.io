// 色彩溢出部分的透明度
let displayable_color_alpha = "0.2";

// 绘图精度
let r = "12";

// 色度上限。实际 ab最大值 测试约小于0.323
let ab_max = "0.33";

let gamut_ab = d3.select("#gamut_ab").node();
let ctx_ab = gamut_ab.getContext("2d");
let gamut_hc = d3.select("#gamut_hc").node();
let ctx_hc = gamut_hc.getContext("2d");
let gamut_hc_cex = d3.select("#gamut_hc_cex").node();
let ctx_hc_cex = gamut_hc_cex.getContext("2d");
let gamut_hl = d3.select("#gamut_hl").node();
let ctx_hl = gamut_hl.getContext("2d");
let gamut_hl_cex = d3.select("#gamut_hl_cex").node();
let ctx_hl_cex = gamut_hl_cex.getContext("2d");
let gamut_lc = d3.select("#gamut_lc").node();
let ctx_lc = gamut_lc.getContext("2d");

let gamut_l = d3.select("#gamut_l").node();
let ctx_l = gamut_l.getContext("2d");
let gamut_l_copy = d3.select("#gamut_l_copy").node();
let ctx_l_copy = gamut_l_copy.getContext("2d");
let gamut_l_c0 = d3.select("#gamut_l_c0").node();
let ctx_l_c0 = gamut_l_c0.getContext("2d");

let gamut_h = d3.select("#gamut_h").node();
let ctx_h = gamut_h.getContext("2d");
let gamut_h_cex = d3.select("#gamut_h_cex").node();
let ctx_h_cex = gamut_h_cex.getContext("2d");
let gamut_h_cmax = d3.select("#gamut_h_cmax").node();
let ctx_h_cmax = gamut_h_cmax.getContext("2d");

let gamut_c = d3.select("#gamut_c").node();
let ctx_c = gamut_c.getContext("2d");

let gamut_c0 = d3.select("#gamut_c0").node();
let ctx_c0 = gamut_c0.getContext("2d");

let svg_hl = d3.select("#svg_hl");
let g_hl = d3.select("#g_hl");
let svg_hl_cex = d3.select("#svg_hl_cex");
let g_hl_cex = d3.select("#g_hl_cex");
let svg_lc = d3.select("#svg_lc");
let g_lc = d3.select("#g_lc");
let svg_hc = d3.select("#svg_hc");
let g_hc = d3.select("#g_hc");
let svg_hc_cex = d3.select("#svg_hc_cex");
let g_hc_cex = d3.select("#g_hc_cex");

draw_ab();     // 初始化色板
draw_hc();
draw_hc_cex();
draw_hl();
draw_hl_cex();
draw_lc();

draw_l();
draw_l_copy();
draw_l_c0();
draw_h();
draw_h_cex();
draw_h_cmax();
draw_c();


select();
function select() {
    let color = d3rgb( oklrch_to_srgb( [input_lightness.value/100, input_chroma.value/100, input_hue.value * Math.PI/180]) );
    //let select = document.getElementById("select");
    //select.style.background = color;
    d3.select("#select").style("background-color", color);
    d3.select("#input_hex").property("value", color.formatHex().slice(1).toUpperCase()); // 去掉#号,转为大写
    if (color.displayable()) {
        d3.select("#input_hex").style("color", "#DDD");
    } else {
        d3.select("#input_hex").style("color", "#777");
    }
    g_hl.attr("transform", `translate(${input_hue.value}, ${(gamut_hl.height - input_lightness.value*2.4)})`);
    g_hl_cex.attr("transform", `translate(${input_hue.value}, ${(gamut_hl_cex.height - input_lightness.value*2.4)})`);
    g_lc.attr("transform", `translate(${input_lightness.value*3.6}, ${(gamut_lc.height - input_chroma.value*240/33)})`);
    g_hc.attr("transform", `translate(${input_hue.value}, ${(gamut_hc.height - input_chroma.value*240/33)})`);
    g_hc_cex.attr("transform", `translate(${input_hue.value}, ${(gamut_hc_cex.height - input_chroma.value*240/33)})`);
}


//=====================================  =====================================//
//                              事件 - 修改 色值                              //
//=====================================  =====================================//
// 修改 亮度(lightness)
input_lightness.addEventListener("change", event_change_lightness);
function event_change_lightness() {
    select();
    draw_ab();  draw_hc();      draw_hc_cex();
    draw_h();   draw_h_cex();   draw_h_cmax();  draw_c();
}

// 修改 色度(chrom) 
input_chroma.addEventListener("change", event_change_chroma);
function event_change_chroma() {
    select();
    draw_hl();  draw_hl_cex();
    draw_l();   draw_l_copy();  draw_h();
}

// 修改 色相(hue) 
input_hue.addEventListener("change", event_change_hue);
function event_change_hue() {
    select();
    draw_lc();
    draw_l();   draw_l_copy(); draw_c();
}

//=====================================  =====================================//
//                              事件 - 点击 色板                              //
//=====================================  =====================================//
d3.select("body").style("user-select", "none");         // 禁止选择文本
d3.selectAll(".div_input").on("mousedown", function(){  // 在input里可选
    d3.select("body").style("user-select", "auto");
    d3.select(document).on("mouseup", function(){
        d3.select("body").style("user-select", "none");
    });
});

svg_hl.on("mousedown", function(){ move_g_hl;
    svg_hl.on("mousemove", move_g_hl);
    d3.select(document).on("mouseup", function(){   // 即使鼠标在svg外也能关闭
        svg_hl.on("mousemove", null);
    });
});
function move_g_hl(event) {
    let [x, y] = d3.pointer(event);
    input_hue.value = x;
    input_lightness.value = parseInt( (240 - y)/2.4 );

    select();
    draw_ab();  draw_hc();      draw_hc_cex();
    draw_lc();
    draw_h();   draw_h_cex();   draw_h_cmax();  draw_c();
    draw_l();   draw_l_copy();
}
svg_hl_cex.on("click", move_g_hl_cex);
function move_g_hl_cex(event) {
    let [x, y] = d3.pointer(event);
    input_hue.value = x;
    input_lightness.value = parseInt( (240 - y)/2.4 );

    select();
    draw_ab();  draw_hc();      draw_hc_cex();
    draw_lc();
    draw_h();   draw_h_cex();   draw_h_cmax();  draw_c();
    draw_l();   draw_l_copy();
}

//=====================================  =====================================//
//                                函数 - 上色                                 //
//=====================================  =====================================//
function draw_ab() {
    ctx_ab.clearRect(0, 0, gamut_ab.width, gamut_ab.height);
    for (let i = 0; i < gamut_ab.width/r; i++) {  // 遍历每个点的a和b的值
        for (let j = 0; j < gamut_ab.height/r; j++) {
            let { color } = pixel_ab(i*r, j*r);     // 使用pixel函数计算出每个点的颜色值
            ctx_ab.fillStyle = color;
            ctx_ab.globalAlpha = color.displayable() ? 1 : displayable_color_alpha; // 判断是否属于sRGB，溢出sRGB时透明度设置为0.5
            ctx_ab.fillRect(i*r, j*r, r, r);        // 对应坐标 绘制矩形 1×1
        }
    }
}
function pixel_ab(i, j) {       // 输入像素坐标
    let A = d3.scaleLinear([0, gamut_ab.width], [-ab_max, ab_max]);  // 横坐标转换为a的坐标
    let B = d3.scaleLinear([0, gamut_ab.height], [ab_max, -ab_max]); // b (反转坐标正方向)
    let a = A(i);
    let b = B(j);
    let color = d3rgb( oklab_to_srgb( toe_ive( [input_lightness.value/100, a, b]) ) );  // 转换为sRGB格式
    return { a, b, color };
}
//-------------------------------------  ---------------------------------------
function draw_hc() {
    ctx_hc.clearRect(0, 0, gamut_hc.width, gamut_hc.height);
    for (let i = 0; i < gamut_hc.width/r; i++) {
        for (let j = 0; j < gamut_hc.height/r; j++) {
            let { color } = pixel_hc(i*r, j*r);
            ctx_hc.fillStyle = color;
            ctx_hc.globalAlpha = color.displayable() ? 1 : displayable_color_alpha;
            ctx_hc.fillRect(i*r, j*r, r, r);
        }
    }
}
function pixel_hc(i, j) {
    let H = d3.scaleLinear([0, gamut_hc.width], [0, 2 * Math.PI]);
    let C = d3.scaleLinear([0, gamut_hc.height], [ab_max, 0]);
    let h = H(i);
    let c = C(j);
    let color = d3rgb( oklrch_to_srgb( [input_lightness.value/100, c, h]) );
    return { h, c, color };
}
function draw_hc_cex() {
    ctx_hc_cex.clearRect(0, 0, gamut_hc_cex.width, gamut_hc_cex.height);
    for (let k = 40; k <= input_lightness.value; k++) {
        for (let i = 0; i < gamut_hc_cex.width/r; i++) {
            for (let j = 0; j < gamut_hc_cex.height/r; j++) {
                let { color } = pixel_hc_cex(i*r, j*r, k);
                ctx_hc_cex.fillStyle = color;
                ctx_hc_cex.globalAlpha = color.displayable() ? 1 : 0;
                ctx_hc_cex.fillRect(i*r, j*r, r, r);
            }
        }
    }
}
function pixel_hc_cex(i, j, k) {
    let H = d3.scaleLinear([0, gamut_hc_cex.width], [0, 2 * Math.PI]);
    let C = d3.scaleLinear([0, gamut_hc_cex.height], [ab_max, 0]);
    let h = H(i);
    let c = C(j);
    let color = d3rgb( oklrch_to_srgb( [k/100, c, h]) );
    return { h, c, color };
}
//-------------------------------------  ---------------------------------------
function draw_hl() {
    ctx_hl.clearRect(0, 0, gamut_hl.width, gamut_hl.height);
    for (let i = 0; i < gamut_hl.width/r; i++) {
        for (let j = 0; j < gamut_hl.height/r; j++) {
            let { color } = pixel_hl(i*r, j*r);
            ctx_hl.fillStyle = color;
            ctx_hl.globalAlpha = color.displayable() ? 1 : displayable_color_alpha;
            ctx_hl.fillRect(i*r, j*r, r, r);
        }
    }
}
function pixel_hl(i, j) {
    let H = d3.scaleLinear([0, gamut_hl.width], [0, 2 * Math.PI]);
    let L = d3.scaleLinear([0, gamut_hl.height], [1, 0]);
    let h = H(i);
    let l = L(j);
    let color = d3rgb( oklrch_to_srgb( [l, input_chroma.value/100, h]) );
    return { h, l, color };
}

function draw_hl_cex() {
    ctx_hl_cex.clearRect(0, 0, gamut_hl_cex.width, gamut_hl_cex.height);
    for (let k = 0; k <= input_chroma.value; k++) {
        for (let i = 0; i < gamut_hl_cex.width/r; i++) {
            for (let j = 0; j < gamut_hl_cex.height/r; j++) {
                let { color } = pixel_hl_cex(i*r, j*r, k);
                ctx_hl_cex.fillStyle = color;
                ctx_hl_cex.globalAlpha = color.displayable() ? 1 : 0;
                ctx_hl_cex.fillRect(i*r, j*r, r, r);
            }
        }
    }
}
function pixel_hl_cex(i, j, k) {
    let H = d3.scaleLinear([0, gamut_hl_cex.width], [0, 2 * Math.PI]);
    let L = d3.scaleLinear([0, gamut_hl_cex.height], [1, 0]);
    let h = H(i);
    let l = L(j);
    let color = d3rgb( oklrch_to_srgb( [l, k/100, h]) );
    return { h, l, color };
}
//-------------------------------------  ---------------------------------------
function draw_lc() {
    ctx_lc.clearRect(0, 0, gamut_lc.width, gamut_lc.height);
    for (let i = 0; i < gamut_lc.width/r; i++) {
        for (let j = 0; j < gamut_lc.width/r; j++) {
            let { color } = pixel_lc(i*r, j*r);
            ctx_lc.fillStyle = color;
            ctx_lc.globalAlpha = color.displayable() ? 1 : displayable_color_alpha;
            ctx_lc.fillRect(i*r, j*r, r, r);
        }
    }
}
function pixel_lc(i, j) {
    let L = d3.scaleLinear([0, gamut_lc.width], [0, 1]);
    let C = d3.scaleLinear([0, gamut_lc.height], [ab_max, 0]);
    let l = L(i);
    let c = C(j);
    let color = d3rgb( oklrch_to_srgb( [l, c, input_hue.value * Math.PI/180]) );
    return { l, c, color };
}
//-------------------------------------  ---------------------------------------
function draw_l() {
    ctx_l.clearRect(0, 0, gamut_l.width, gamut_l.height);
    for (let i = 0; i < gamut_l.width/r; i++) {
        let { color } = pixel_l(i*r);
        ctx_l.fillStyle = color;
        ctx_l.globalAlpha = color.displayable() ? 1 : displayable_color_alpha;
        ctx_l.fillRect(i*r, 0, r, gamut_l.height);
    }
}
function pixel_l(i) {
    let L = d3.scaleLinear([0, gamut_l.width], [0, 1]);
    let l = L(i);
    let color = d3rgb( oklrch_to_srgb( [l, input_chroma.value/100, input_hue.value * Math.PI/180]) );
    return { l, color };
}
function draw_l_copy() {
    ctx_l_copy.clearRect(0, 0, gamut_l_copy.width, gamut_l_copy.height);
    ctx_l_copy.save();
    ctx_l_copy.translate(0, gamut_l_copy.height);   // y 轴 正方向 下移240
    ctx_l_copy.rotate(-Math.PI/2 );                 // 逆时针90°
    ctx_l_copy.drawImage(gamut_l, 0, 0, gamut_l_copy.height, gamut_l_copy.width);   // 注意宽高顺序
    ctx_l_copy.restore();
}
function draw_l_c0() {
    ctx_l_c0.clearRect(0, 0, gamut_l_c0.width, gamut_l_c0.height);
    for (let i = 0; i < gamut_l_c0.width/r; i++) {
        let { color } = pixel_l_c0(i*r);
        ctx_l_c0.fillStyle = color;
        ctx_l_c0.globalAlpha = color.displayable() ? 1 : displayable_color_alpha;
        ctx_l_c0.fillRect(i*r, 0, r, gamut_l_c0.height);
    }
}
function pixel_l_c0(i) {
    let L = d3.scaleLinear([0, gamut_l_c0.width], [0, 1]);
    let l = L(i);
    let color = d3rgb( oklab_to_srgb( [toe_ive(l), 0, 0]) );
    return { l, color };
}
//-------------------------------------  ---------------------------------------
function draw_h() {
    ctx_h.clearRect(0, 0, gamut_h.width, gamut_h.height);
    for (let i = 0; i < gamut_h.width/r; i++) {
        let { color } = pixel_h(i*r);
        ctx_h.fillStyle = color;
        ctx_h.globalAlpha = color.displayable() ? 1 : displayable_color_alpha;
        ctx_h.fillRect(i*r, 0, r, gamut_h.height);
    }
}
function pixel_h(i) {
    let H = d3.scaleLinear([0, gamut_h.width], [0, 2 * Math.PI]);
    let h = H(i);
    let color = d3rgb( oklrch_to_srgb( [input_lightness.value/100, input_chroma.value/100, h]) );
    return { h, color };
}

function draw_h_cex() {
    ctx_h_cex.clearRect(0, 0, gamut_h_cex.width, gamut_h_cex.height);
    for (let k = 0; k <= 33; k++) {
        for (let i = 0; i < gamut_h_cex.width/r; i++) {
            let { color } = pixel_h_cex(i*r, input_lightness.value, k);
            ctx_h_cex.fillStyle = color;
            ctx_h_cex.globalAlpha = color.displayable() ? 1 : 0;
            ctx_h_cex.fillRect(i*r, 0, r, gamut_h_cex.height);
        }
    }
}
function pixel_h_cex(i, m, k) {
    let H = d3.scaleLinear([0, gamut_h_cex.width], [0, 2 * Math.PI]);
    let h = H(i);
    let color = d3rgb( oklrch_to_srgb( [m/100, k/100, h]) );
    return { h, color };
}
function draw_h_cmax() {
    ctx_h_cmax.clearRect(0, 0, gamut_h_cmax.width, gamut_h_cmax.height);
    for (let k = 0; k <= 33; k++) {
        for (let m = 2; m <= input_lightness.value; m++) {  // 下限m取1或0有bug
            for (let i = 0; i < gamut_h_cmax.width/r; i++) {
                let { color } = pixel_h_cmax(i*r, m, k);
                ctx_h_cmax.fillStyle = color;
                ctx_h_cmax.globalAlpha = color.displayable() ? 1 : 0;
                ctx_h_cmax.fillRect(i*r, 0, r, gamut_h_cmax.height);
            }
        }
    }
}
function pixel_h_cmax(i, m, k) {
    let H = d3.scaleLinear([0, gamut_h_cmax.width], [0, 2 * Math.PI]);
    let h = H(i);
    let color = d3rgb( oklrch_to_srgb( [m/100, k/100, h]) );
    return { h, color };
}
//-------------------------------------  ---------------------------------------
function draw_c() {
    ctx_c.clearRect(0, 0, gamut_c.width, gamut_c.height);
    for (let j = 0; j < gamut_c.height/r; j++) {
        let { color } = pixel_c(j*r);
        ctx_c.fillStyle = color;
        ctx_c.globalAlpha = color.displayable() ? 1 : displayable_color_alpha;
        ctx_c.fillRect(0, j*r, gamut_c.width, r);
    }
}
function pixel_c(i) {
    let C = d3.scaleLinear([0, gamut_c.height], [ab_max, 0]);
    let c = C(i);
    let color = d3rgb( oklrch_to_srgb( [input_lightness.value/100, c, input_hue.value * Math.PI/180]) );
    return { c, color };
}
//-------------------------------------  ---------------------------------------


//=====================================  =====================================//
//                      格式 - 归一化的sRGB数组转d3.rgb                       //
//=====================================  =====================================//
function d3rgb(arr) {
    return d3.rgb(arr[0] * 255, arr[1] * 255, arr[2] * 255);
}
