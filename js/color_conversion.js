// 公式

// sRGB ↔ 线性RGB (伽马加解密)

function gamma_inv(x) { // 通道间转换
    return .04045 >= x ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4);
}

function srgb_to_lrgb(arr) {
    return arr.map(function(num) { // 对数组的每个元素 做 伽马解算
      return gamma_inv(num);
    });
}

function gamma(x){ // 通道间转换
    return .0031308 >= x ? x * 12.92 : Math.pow(x, .4166666666666667) * 1.055 - .055;
}

function lrgb_to_srgb(arr) {
    return arr.map(function(num) { // 对数组的每个元素 做 伽马运算
      return gamma(num);
    });
}

// 线性RGB ↔ LMS

function lrgb_to_lms(arr) {
    var r = arr[0];
    var g = arr[1];
    var b = arr[2];

    return [ 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b,
             0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
             0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
            ];
}

function lms_to_lrgb(arr) {
    var l = arr[0];
    var m = arr[1];
    var s = arr[2];

    return [ (+4.0767416621 * l -3.3077115913 * m +0.2309699292 * s),
             (-1.2684380046 * l +2.6097574011 * m -0.3413193965 * s),
             (-0.0041960863 * l -0.7034186147 * m +1.7076147010 * s),
            ];
}

// LMS ↔ OKLAB

function lms_to_oklab(arr) {
    var l = arr[0];
    var m = arr[1];
    var s = arr[2];

    var l_ = Math.cbrt(l);  // 开立方根
    var m_ = Math.cbrt(m);
    var s_ = Math.cbrt(s);
    
    return [ 0.2104542553*l_ +0.7936177850*m_ -0.0040720468*s_,
             1.9779984951*l_ -2.4285922050*m_ +0.4505937099*s_,
             0.0259040371*l_ +0.7827717662*m_ -0.8086757660*s_,
            ];
}

function oklab_to_lms(arr) {
    var l = arr[0];
    var a = arr[1];
    var b = arr[2];

    var l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    var m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    var s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    return [ l_*l_*l_, m_*m_*m_, s_*s_*s_ ];
}

// L ↔ Lr

const k_1 = 0.206;
const k_2 = 0.03;
const k_3 = ( 1+k_1 ) / ( 1+k_2 );

function toe(arr) {
    var l = arr[0]
    
    arr[0] = 0.5*(k_3*l - k_1 + Math.sqrt((k_3*l - k_1)*(k_3*l - k_1) + 4*k_2*k_3*l));

    return arr;
}

function toe_ive(arr) {
    var l = arr[0];
    
    arr[0] = ( l*l + k_1*l )/( k_3 * ( l+k_2 ) );

    return arr;
}

// AB ↔ CH

function ab_to_ch(arr) {
    var a = arr[1];
    var b = arr[2];

    var c = Math.sqrt(a*a + b*b);
    var h = 0.5 + 0.5*Math.atan2(-b, -a)/Math.PI; 

    return [arr[0], c, h];
}

function ch_to_ab(arr) {
    var c = arr[1];
    var h = arr[2];
      
    var a = c * Math.cos(h);
    var b = c * Math.sin(h); 
    return [arr[0], a, b];
}

// 附加函数 方便简写

function srgb_to_oklab(arr) {
    return lms_to_oklab(lrgb_to_lms(srgb_to_lrgb(arr)));
}

function oklab_to_srgb(arr) {
    return lrgb_to_srgb(lms_to_lrgb(oklab_to_lms(arr)));
}

function srgb_to_oklrch(arr) {
    return toe(ab_to_ch(srgb_to_oklab(arr)));
}

function oklrch_to_srgb(arr) {
    return oklab_to_srgb(ch_to_ab(toe_ive(arr)));
}

