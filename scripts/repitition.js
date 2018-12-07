const repititions_input = document.getElementById('repititions');
const error_input = document.getElementById('error');
const encodeArea_textArea = document.getElementById('encode-area');
const encode_img = document.getElementById('encode');
const encodingArea_textArea = document.getElementById('encoding-area');
const decode_img = document.getElementById('decode');
const decodeArea_textArea = document.getElementById('decode-area');

$(document).ready(function () {
    encode_img.addEventListener('click', function () {
        var input = encodeArea_textArea.value;
        var binaryInput = toBinary(input);
        var repititions = parseInt(repititions_input.value, 10);
        var error = parseFloat(error_input.value, 10);
        var encoding = encode(binaryInput, repititions, error);
        encodingArea_textArea.value = encoding;
    });

    decode_img.addEventListener('click', function () {
        var input = encodingArea_textArea.value;
        var repititions = parseInt(repititions_input.value, 10);
        var binaryDecoding = decode(input, repititions);
        var decoding = toText(binaryDecoding);
        decodeArea_textArea.value = decoding;
        console.log(diff());
    });
});

function diff() {
    var i = 0;
    var d = 0;
    console.log(encodeArea_textArea.value.length + " " + decodeArea_textArea.value.length);
    while (i < encodeArea_textArea.value.length && i < decodeArea_textArea.value.length) {
        if (encodeArea_textArea.value.charAt(i) != decodeArea_textArea.value.charAt(i)) {
            d++;
        }
        i++;
    }
    return d;
}

function encode(input, rep, err) {
    var s = "";
    for (var i = 0; i < input.length; i++) {
        for (var j = 0; j < rep; j++) {
            var rand = Math.random();
            if (rand <= err) {
                s += flip(input.charAt(i));
            } else {
                s += input.charAt(i);
            }
        }
        if (i !== input.length -1) {
            s += " ";
        }
    }
    return s;
}

function flip(bit) {
    if (bit == '0') return 1;
    return 0;
}

function decode(input) {
    var s = "";
    input = input.split(" ");
    for (var i = 0; i < input.length; i++) {
        s += mostFrequent(input[i]);
    }
    return s;
}

function mostFrequent(block) {
    // console.log(block);
    var ones = 0;
    var zeros = 0;
    for (var i = 0; i < block.length; i++) {
        if (block.charAt(i) == '1') ones++;
        else zeros++;
    }
    if (ones > zeros) return '1';
    else if (zeros > ones) return '0';
    else if (Math.random() >= .5) return '1';
    else return '0';
}

function toBinary(input) {
    var s = "";
    for (var i = 0; i < input.length; i++) {
        s += input.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return s;
}

function toText(input) {
    s = "";
    for (var i = 0; i < input.length; i+=8) {
        s += String.fromCharCode(parseInt(input.substring(i, i+8), 2));
    }
    return s;
}