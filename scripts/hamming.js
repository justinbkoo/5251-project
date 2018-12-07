const i1_input = document.getElementById('i1');
const i2_input = document.getElementById('i2');
const i3_input = document.getElementById('i3');
const i4_input = document.getElementById('i4');
const o1_input = document.getElementById('o1');
const o2_input = document.getElementById('o2');
const o3_input = document.getElementById('o3');
const o4_input = document.getElementById('o4');
const o5_input = document.getElementById('o5');
const o6_input = document.getElementById('o6');
const o7_input = document.getElementById('o7');
const encode_button = document.getElementById('encode');
const decode_button = document.getElementById('decode');

const G = math.matrix([[1,1,1,0,0,0,0],
                      [1,0,0,1,1,0,0],
                      [0,1,0,1,0,1,0],
                      [1,1,0,1,0,0,1]]);

const H = math.matrix([
    [0,0,0,1,1,1,1],
    [0,1,1,0,0,1,1],
    [1,0,1,0,1,0,1]
]);

$(document).ready(function () {
    encode_button.addEventListener('click', function () {
        var input = getDecoding();
        var c = F2(math.multiply(input, G));
        o1_input.value = c._data[0];
        o2_input.value = c._data[1];
        o3_input.value = c._data[2];
        o4_input.value = c._data[3];
        o5_input.value = c._data[4];
        o6_input.value = c._data[5];
        o7_input.value = c._data[6];
    });
    decode_button.addEventListener('click', function () {
        var input = getEncoding();
        var y = decode(input);
        i1_input.value = y._data[2];
        i2_input.value = y._data[4];
        i3_input.value = y._data[5];
        i4_input.value = y._data[6];
        
    });
});

function decode(input) {
    var c = F2(math.multiply(input, math.transpose(H)));
    console.log(c);
    if (c._data[0] == 0 && c._data[1] == 0 && c._data[2] == 0) {
        return input;
    } else {
        var errorBit = 4*c._data[0] + 2*c._data[1] + 1*c._data[2];
        input._data[errorBit-1] = flip(input._data[errorBit-1]);
    }
    return input;
}

function flip(val) {
    if (val == 0) return 1;
    return 0;
}

function getDecoding() {
    return math.matrix(
        [parseInt(i1_input.value,10) % 2,
         parseInt(i2_input.value,10) % 2,
         parseInt(i3_input.value,10) % 2,
         parseInt(i4_input.value,10) % 2]);
}

function getEncoding() {
    return math.matrix(
        [parseInt(o1_input.value,10) % 2,
         parseInt(o2_input.value,10) % 2,
         parseInt(o3_input.value,10) % 2,
         parseInt(o4_input.value,10) % 2,
         parseInt(o5_input.value,10) % 2,
         parseInt(o6_input.value,10) % 2,
         parseInt(o7_input.value,10) % 2,]
    )
}

function F2(vector) {
    var ret = [];
    for (var i = 0; i < vector._data.length; i++) {
        ret.push(vector._data[i] % 2);
    }
    return math.matrix(ret);
}