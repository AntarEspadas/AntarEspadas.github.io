
class RelativeElementSizes {
    constructor(elementWith, elementHeight, targetPercentage) {
        this.elementWith = elementWith;
        this.elementHeight = elementHeight;
        this.targetPercentage = targetPercentage;
        this.xPositon;
        this.yPosition;
        this.xSize;
        this.ySize;
    }
    axisPriority() {
        var maxedHeight = w(100) * this.elementHeight / this.elementWith;
        if (maxedHeight >= h(100)) {
            return "y";
        }
        return "x";
    };
    getSizes() {
        if (this.axisPriority() == "x") {
            this.xSize = w(this.targetPercentage);
            this.ySize = w(this.elementHeight * this.targetPercentage / this.elementWith);
            this.xPositon = w((100 - this.targetPercentage) / 2);
            this.yPosition = h(50) - this.ySize / 2;
        }
        else {
            this.xSize = h(this.elementWith * this.targetPercentage / this.elementHeight);
            this.ySize = h(this.targetPercentage);
            this.xPositon = w(50) - this.xSize / 2;
            this.yPosition = h((100 - this.targetPercentage) / 2);
        }
    };
}
class Pieces {
    constructor(image, xPieces, yPieces) {
        this.image = image;
        this.xPieces = xPieces;
        this.yPieces = yPieces;
        this.length = xPieces * yPieces - 1;

        this.xSize = image.naturalWidth / this.xPieces;
        this.ySize = image.naturalHeight / this.yPieces;

        this.pieces = [];
        this.altPieces = [];
        for(var y = 0; y < yPieces; y++){
            this.pieces.push([]);
            this.altPieces.push([]);
            for(var x = 0; x < xPieces; x++){
                this.pieces[y].push(new Piece(this.image, this.xSize * x, this.ySize * y, this.xSize, this.ySize, y * this.xPieces + x));
            }
        }

        this.blankCoords = {
            "x" : this.pieces[0].length-1,
            "y" : this.pieces.length-1
        }
        this.pieces[this.blankCoords.y][this.blankCoords.x] = new BlankPiece();
    }
    draw(xPositon, yPosition, xSize, ySize) {
        for (var y = 0; y < this.yPieces; y++) {
            for (var x = 0; x < this.xPieces; x++) {
                //c.drawImage(this.image, this.pieces[y][x].xPos, this.pieces[y][x].yPos, this.xSize, this.ySize, xPositon + xSize / this.xPieces * x, yPosition + ySize / this.yPieces * y, xSize / this.xPieces, ySize / this.yPieces);
                this.pieces[y][x].draw(xPositon + xSize / this.xPieces * x, yPosition + ySize / this.yPieces * y, xSize / this.xPieces, ySize / this.yPieces);
            }
        }
    }
    movePiece(direction){
        var dx = 0;
        var dy = 0;
        var x = this.blankCoords.x;
        var y = this.blankCoords.y;
        switch (direction) {
            case "a":
            case "ArrowLeft":
            case "left":
                dx = 1;
                break;
            case "d":
            case "ArrowRight":
            case "right":
                dx = -1;
                break;
            case "w":
            case "ArrowUp":
            case "up":
                dy += 1;
                break;
            case "s":
            case "ArrowDown":
            case "down":
                dy += -1;
                break;
            default:
                return;
        }
        x += dx;
        y += dy;
        if(x >= this.pieces[0].length || y >= this.pieces.length || x < 0 || y < 0){
            return;
        }
        this.pieces[this.blankCoords.y][this.blankCoords.x] = this.pieces[y][x];
        this.pieces[y][x].moving.x = dx;
        this.pieces[y][x].moving.y = dy;
        this.pieces[y][x] = new BlankPiece();
        this.blankCoords.x = x;
        this.blankCoords.y = y;
    }
    get (index){
        if(index < 0 || index >= this.length){
            return undefined;
        }
        var yIndex = Math.floor(index / this.xPieces);
        var xIndex = index % this.xPieces;
        return this.pieces[yIndex][xIndex];
    }
    set (index, value){
        if(index < 0 || index >= this.length){
            throw new RangeError();
        }
        var yIndex = Math.floor(index / this.xPieces);
        var xIndex = index % this.xPieces;
        this.pieces[yIndex][xIndex] = value;
    }
    shuffle(){
        randomPermutation(this);
        for(var y = 0; y < this.yPieces; y++){
            for(var x = 0; x < this.xPieces; x++){
                this.altPieces[y][x] = this.pieces[y][x];
            }
        }
        var N = mergeSort(this);
        //console.log("N: " + N);
        var e = this.yPieces;
        //console.log("e: " + e);
        var result = N + e;
        var solveable = result % 2 == this.yPieces % 2;
        //console.log("N + e: " + result + ", " + (solveable?"solveable":"unsolveable"));

        var aux = this.pieces;
        this.pieces = this.altPieces;
        this.altPieces = aux;

        if(!solveable){
            var aux = this.get(0);
            this.set(0, this.get(1));
            this.set(1,aux);
            
            /*for(var y = 0; y < this.yPieces; y++){
                for(var x = 0; x < this.xPieces; x++){
                    this.altPieces[y][x] = this.pieces[y][x];
                }
            }
            var N = mergeSort(this);
            console.log("N: " + N);
            var e = this.yPieces;
            console.log("e: " + e);
            var result = N + e;
            var solveable = result % 2 == this.yPieces % 2;
            console.log("N + e: " + result + ", " + (solveable?"solveable":"unsolveable"));

            var aux = this.pieces;
            this.pieces = this.altPieces;
            this.altPieces = aux;*/
        }
    }
}
class Piece{
    constructor(image, xPos, yPos, xSize, ySize, index){
        this.image = image;
        this.xPos = xPos;
        this.yPos = yPos;
        this.xSize = xSize;
        this.ySize = ySize;
        this.index = index;
        this.moving = {
            "x" : 0,
            "y": 0
        }
    }
    draw(dx, dy, dw, dh){
        var difx = dw * this.moving.x;
        var dify = dh * this.moving.y;
        c.fillStyle = canvas.style.backgroundColor;
        c.drawImage(image, this.xPos, this.yPos, this.xSize, this.ySize, dx + difx, dy + dify, dw, dh)
        c.strokeRect(dx + difx,dy + dify,dw,dh);
        if(this.moving.x < 0){
            this.moving.x += 0.1;
        }
        if(this.moving.x > 0){
            this.moving.x -= 0.1;
        }
        if(this.moving.y < 0){
            this.moving.y +=0.1;
        }
        if(this.moving.y > 0){
            this.moving.y -= 0.1;
        }
        this.moving.x = Math.round((this.moving.x + Number.EPSILON) * 10) / 10;
        this.moving.y = Math.round((this.moving.y + Number.EPSILON) * 10) / 10;
    }
    compareTo(piece){
        return this.index - piece.index;
    }
}
class BlankPiece{
    constructor(){

    }
    draw(x, y, w, h){
        //c.fillRect(x, y, w, h);
    }
}

var canvas = document.getElementsByTagName("canvas")[0];
var c = canvas.getContext('2d');
var sizes;
var canvasPieces;
//canvas.style.backgroundColor ="red";
var image = document.createElement("img");
image.src = "https://cdn.discordapp.com/attachments/241011471897591818/722123307628888104/1ee3b0936a95fadca90698d872a94fa4.png";
image.alt = "image";
window.addEventListener("keydown", function(){
    //console.log(event.key);
    canvasPieces.movePiece(event.key);
});
window.addEventListener("resize", adjustElements)
image.onload = function(){
    sizes = new RelativeElementSizes(image.naturalWidth, image.naturalHeight, 95);
    canvasPieces = new Pieces(image,4,4);
    adjustElements();
    canvasPieces.shuffle();
    animation();
}

function h (heightPercent){
    return canvas.height * heightPercent / 100;
}
function w (withPercent){
    return canvas.width * withPercent / 100;
}
function adjustElements(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function animation(){
    requestAnimationFrame(animation);
    c.clearRect(0,0,w(100),h(100));
    sizes.getSizes();
    canvasPieces.draw(sizes.xPositon, sizes.yPosition, sizes.xSize, sizes.ySize);
}
function mergeSort(pieces){
    return recursiveMergeSort(pieces, 0, pieces.length);
}
function recursiveMergeSort(pieces, startIndex, endIndex){
    var inversions = 0;
    if(endIndex - startIndex == 1){
        return inversions;
    }
    var middle = Math.floor((endIndex + startIndex) / 2);
    inversions += recursiveMergeSort(pieces, startIndex, middle);
    inversions += recursiveMergeSort(pieces, middle, endIndex);

    return inversions + merge(pieces, startIndex, middle, endIndex);
}
function merge(pieces, startIndex, middleIndex, endIndex){
    var inversions = 0;
    var i = startIndex, k = middleIndex;
    var auxArray = [];
    while(i < middleIndex && k < endIndex){
        if(pieces.get(i).compareTo(pieces.get(k)) > 0){
            auxArray.push(pieces.get(k++));
            inversions += middleIndex - i;
        }
        else{
            auxArray.push(pieces.get(i++));
        }
    }
    while(i < middleIndex){
        auxArray.push(pieces.get(i++));
    }
    while(k < endIndex){
        auxArray.push(pieces.get(k++));
    }
    for(var i = 0; i < auxArray.length; i++){
        pieces.set(startIndex + i, auxArray[i]);
    }
    return inversions;
}
function randomPermutation(pieces){
    for(var i = 0; i < pieces.length; i++){
        var randomIndex = Math.floor(Math.random() * (pieces.length - i));
        var aux = pieces.get(pieces.length - 1 -i);
        pieces.set(pieces.length - 1 -i,pieces.get(randomIndex));
        pieces.set(randomIndex,aux);
    }
}