const encodeArea_textArea = document.getElementById('encode-area');
const decodeArea_textArea = document.getElementById('decode-area');
const encode_button = document.getElementById("encode");
const decode_button = document.getElementById("decode");
const interpretation_ul = document.getElementById("interpretation");
const visualizationLink_p = document.getElementById("visualization-link");
const lowercasePreset_button = document.getElementById("lowercase");
const diversePreset_button = document.getElementById("diverse");
const unbalancedPreset_button = document.getElementById("unbalanced");
const distinctPreset_button = document.getElementById("distinct");
const mysteryPreset_button = document.getElementById("mystery");

const canvasWidth = 0;
const canvasHeight = 0;
const nodeRadius = 25;
const nodeMargin = 40;

var encoding = {};
var treeRoot = null;
var i = 0;
var maxX = -1;
var maxY = -1;
var fontsize = 12;

function Node(val, frequency) {
    this.val = val;
    this.frequency = frequency;
    this.left = null;
    this.right = null;
    this.x = null;
    this.y = null;
}
function setup() {
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent("canvas");
  textSize(fontsize);
  textAlign(CENTER, CENTER);
}

function draw() {
    background(220);
    drawTree(treeRoot, "");
}

function drawTree(treeRoot, path) {
    if (treeRoot == null) return;
    if (treeRoot.left !== null) {
        line(treeRoot.x, treeRoot.y, treeRoot.left.x, treeRoot.left.y);
        drawTree(treeRoot.left, path + "0");
    }
    if (treeRoot.right !== null) {
        line(treeRoot.x, treeRoot.y, treeRoot.right.x, treeRoot.right.y);
        drawTree(treeRoot.right, path + "1");
    }
    ellipse(treeRoot.x, treeRoot.y, nodeRadius, nodeRadius);
    text(treeRoot.frequency, treeRoot.x, treeRoot.y);
    if (treeRoot.right === null && treeRoot.left === null) {
        text(treeRoot.val, treeRoot.x, treeRoot.y + nodeRadius);
        text(path, treeRoot.x, treeRoot.y + 2*nodeRadius);
    }
}

function assignTreeCoordinates(treeRoot) {
    maxX = -1;
    maxY = -1;
    i = nodeRadius;
    assignTreeCoordinatesHelper(treeRoot, nodeRadius);
}

function assignTreeCoordinatesHelper(treeRoot, depth) {
    if (treeRoot == null) return;
    if (treeRoot.left !== null) {
        assignTreeCoordinatesHelper(treeRoot.left, depth + nodeRadius);
    }
    treeRoot.x = i;
    treeRoot.y = depth;
    if (i > maxX) { maxX = i};
    if (depth > maxY) {maxY = depth};
    i+=nodeRadius;
    if (treeRoot.right !== null) {
        assignTreeCoordinatesHelper(treeRoot.right, depth + nodeRadius);
    }
    return;
}

$(document).ready(function () {
    visualizationLink_p.style.visibility = "hidden";
    interpretation_ul.style.visibility = "hidden";
    encode_button.addEventListener('click', function() {
        var input = encodeArea_textArea.value;
        encode(input);
        visualizationLink_p.style.visibility = "visible";
        interpretation_ul.style.visibility = "visible";
    });
    decode_button.addEventListener('click', function() {
        var input = decodeArea_textArea.value;
        decode(input);
    });
    lowercasePreset_button.addEventListener('click', function() {
        encodeArea_textArea.value = "abcdefghijklmnopqrstuvwxyz";
    });
    diversePreset_button.addEventListener('click', function() {
        encodeArea_textArea.value = "The quick brown fox jumps over the lazy dog.";
    });
    unbalancedPreset_button.addEventListener('click', function() {
        var s = "";
        for (var i = 65; i < 80; i++) {
            for (var j = 1; j <= Math.pow(2,i - 65); j++) {
                s += String.fromCharCode(i);
            }
        }
        encodeArea_textArea.value = s;
    });
    distinctPreset_button.addEventListener('click', function() {
        var s = "";
        for (var i = 32; i < 127; i++) {
            for (var j = 1; j <= i -32 + 1; j++) {
                s += String.fromCharCode(i);
            }
        }
        encodeArea_textArea.value = s;
    });
    mysteryPreset_button.addEventListener('click', function() {
        encodeArea_textArea.value = "???!";
    });
});

function encode(input) {
    treeRoot = constructTree(input);
    var myEncoding = getEncoding(treeRoot);
    var encoding = "";
    for (var i = 0; i < input.length; i++) {
        encoding += myEncoding[input.charAt(i)];
    }
    decodeArea_textArea.value = encoding;
    assignTreeCoordinates(treeRoot);
    resizeCanvas(maxX + nodeRadius, maxY + 3*nodeRadius);
}

function decode(input) {
    var s = "";
    var t = treeRoot;
    for (var i = 0; i < input.length; i++) {
        if (input.charAt(i) == '0') {
            t = t.left;
        } else if (input.charAt(i) == '1') {
            t = t.right;
        }
        if (t.left == null && t.right == null) {
            s += t.val;
            t = treeRoot;
        }
    }
    encodeArea_textArea.value = s;
}

function constructTree(input) {
    var characterFrequencies = frequencies(input);
    var q = NodeQueue(characterFrequencies);
    while (q.length >= 2) {
        var x = q.dequeue();
        var y = q.dequeue();
        var z = new Node(null, x.frequency + y.frequency);
        z.left = x;
        z.right = y;
        q.queue(z);
    }
    return q.dequeue();
}

function getEncoding(root) {
    encoding = {};
    getEncodingHelper(root, "");
    return encoding;
}

function getEncodingHelper(root, path) {
    if (root == null){
        return;
    }
    if (root.left == null && root.right == null) {
        encoding[root.val] = path;
    }
    if (root.left !== null) {
        getEncodingHelper(root.left, path + "0");
    }
    if (root.right !== null) {
        getEncodingHelper(root.right, path + "1");
    }
    return;
}

function frequencies(text) {
    var dict = {};
    for (var i = 0; i < text.length; i++) {
        if (dict[text.charAt(i)]) {
            dict[text.charAt(i)]++;
        } else {
            dict[text.charAt(i)] = 1;
        }
    }
    return dict;
}

function NodeQueue(frequencies) {
    var queue = new PriorityQueue({comparator: function(a, b) {
        return a.frequency - b.frequency;
    }});
    for (var char in frequencies) {
        var node = new Node(char, frequencies[char]);
        queue.queue(node);
    }
    return queue;
}