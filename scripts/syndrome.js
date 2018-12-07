const i1_input = document.getElementById('i1');
const i2_input = document.getElementById('i2');
const i3_input = document.getElementById('i3');
const i4_input = document.getElementById('i4');
const i5_input = document.getElementById('i5');
const o1_input = document.getElementById('o1');
const o2_input = document.getElementById('o2');
const o3_input = document.getElementById('o3');
const o4_input = document.getElementById('o4');
const o5_input = document.getElementById('o5');
const decode_button = document.getElementById('decode');


function coset(s, leader) {
    this.s = s;
    this.leader = leader;
}
const cosets = [
    new coset(["00000","10010","01011","00111","11001","10101","01100","11110"], "00000"),
    new coset(["00001","10011","01010","00110","11000","10100","01100","11111"], "00001"),
    new coset(["00010","10000","01001","00101","11011","10111","01110","11100"], "00010"),
    new coset(["00100","10110","01111","00011","11101","10001","01000","11010"], "00100")
];

$(document).ready(function () {
    decode_button.addEventListener('click', function () {
        var input = i1_input.value
        + i2_input.value
        + i3_input.value
        + i4_input.value
        + i5_input.value;
        var y = decode(input);
        o1_input.value = y.charAt(0);
        o2_input.value = y.charAt(1);
        o3_input.value = y.charAt(2);
        o4_input.value = y.charAt(3);
        o5_input.value = y.charAt(4);
    });
});

function decode(input) {
    x = null;
    for (var i = 0; i < cosets.length; i++) {
        if (cosets[i].s.includes(input)) {
            x = cosets[i];
        }
    }
    return binaryStringSubtraction(input, x.leader);

}

function binaryStringSubtraction(s1, s2) {
    var s = "";
    for (var i = 0; i < s1.length; i++) {
        if (s1.charAt(i) !== s2.charAt(i)) {
            s += "1";
        } else {
            s += "0";
        }
    }
    return s;
}