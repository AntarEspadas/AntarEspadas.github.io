var c = document.createElement("canvas");
var cxt = c.getContext("2d");
var cVisible = document.getElementsByTagName("canvas")[0];
var cxtVisible = cVisible.getContext("2d");
var tamanio;
var serpiente;
const DIRECCION = {
    "IZQUIERDA" : -1,
    "DERECHA" : 1,
    "ARRIBA" : -2,
    "ABAJO" : 2
}

function TamanioRelativo (anchoElemento, altoElemento, porcentaje) {
    this.anchoElemento = anchoElemento;
    this.altoElemento = altoElemento;
    this.porcentaje = porcentaje;
    this.posicionX;
    this.posicionY;
    this.tamanioX;
    this.tamanioY;
    
    this.ejePrioritario = function() {
        var altoMaximo = wVentana(100) * this.altoElemento / this.anchoElemento;
        if (altoMaximo >= hVentana(100)) {
            return "y";
        }
        return "x";
    };
    
    this.obtenerValores = function() {
        if (this.ejePrioritario() == "x") {
            this.tamanioX = wVentana(this.porcentaje);
            this.tamanioY = wVentana(this.altoElemento * this.porcentaje / this.anchoElemento);
            this.posicionX = wVentana((100 - this.porcentaje) / 2);
            this.posicionY = hVentana(50) - this.tamanioY / 2;
        }
        else {
            this.tamanioX = hVentana(this.anchoElemento * this.porcentaje / this.altoElemento);
            this.tamanioY = hVentana(this.porcentaje);
            this.posicionX = wVentana(50) - this.tamanioX / 2;
            this.posicionY = hVentana((100 - this.porcentaje) / 2);
        }
    };
}
function Serpiente () {
    this.direccion = DIRECCION.DERECHA;
    this.colaBotones = [];
    this.partes = [];
    this.celdasLibres = [];
    this.fruta = new Fruta(this);
    this.gameOver = false;
    this.crecer = false;
    this.puntaje = new Puntaje();
    for(var x = 0; x < 48; x++){
        for(var y = 0; y < 27; y++){
            this.celdasLibres[x + "," + y] = true;
        }
    }
    for(var x = 20; x < 24; x++){
        this.partes.unshift(new Parte(x,13));
        delete this.celdasLibres[x + "," + 13];
    }
    this.fruta.generar();
    this.dibujar = function () {
        this.fruta.dibujar();
        this.partes.forEach(parte => {
            parte.dibujar();
        });
        this.puntaje.dibujar();
    }
    this.actualizar = function (){
        var x = 0;
        var y = 0;
        if(this.colaBotones.length != 0){
            this.direccion = this.colaBotones.pop();
        }
        switch (this.direccion) {
            case DIRECCION.IZQUIERDA:
                x = -1;
                break;
            case DIRECCION.DERECHA:
                x = 1;
                break;
            case DIRECCION.ARRIBA:
                y = -1
                break;
            case DIRECCION.ABAJO:
                y = 1;
                break;
            default:
                break;
        }
        var xCabeza = this.partes[0].posicionX + x;
        var yCabeza = this.partes[0].posicionY + y;
        var parte;
        if(this.crecer){
            this.crecer = false;
            parte = new Parte();
        }
        else{
            parte = this.partes.pop();
            this.celdasLibres[parte.posicionX + "," + parte.posicionY] = true;
        }
        parte.posicionX = xCabeza;
        parte.posicionY = yCabeza;
        if(!this.celdasLibres[parte.posicionX + "," + parte.posicionY]){
            this.gameOver = true;
        }
        delete this.celdasLibres[parte.posicionX + "," + parte.posicionY];
        this.partes.unshift(parte);
        if(xCabeza == this.fruta.x && yCabeza == this.fruta.y){
            this.puntaje.puntos++;
            this.crecer = true;
            this.fruta.generar();
        }
        if(this.gameOver){
            console.log("game over");
        }
    }
}
function Parte (posicionX, posicionY) {

    this.posicionX = posicionX;
    this.posicionY = posicionY;

    this.dibujar = function () {
        var tam = c.width / tamanio.anchoElemento / 3;
        var posicion = convertirPosicion(this.posicionX, this.posicionY, tam);
        cxt.fillStyle = "rgb(0,0,0)";
        cxt.fillRect(posicion.x + tam * 0.1, posicion.y + tam * 0.1, tam * 0.8, tam * 0.8);
    }
}
function Fruta (serpiente){
    this.serpiente = serpiente;
    this.x;
    this.y;
    this.generar = function (){
        var coordenadas = Object.keys(serpiente.celdasLibres);
        coordenadas = coordenadas[Math.floor(Math.random()*coordenadas.length)];
        coordenadas = coordenadas.split(",");
        this.x = +coordenadas[0];
        this.y = +coordenadas[1];
    }
    this.dibujar = function (){
        var tam = c.width / tamanio.anchoElemento / 3;
        var posicion = convertirPosicion(this.x, this.y, tam)
        cxt.fillStyle = "rgb(255,255,255)";
        cxt.fillRect(posicion.x + tam * 0.1, posicion.y + tam * 0.1, tam * 0.8, tam * 0.8);
    }
}
function Puntaje (){
    this.puntos = 0;

    this.dibujar = function (){
        var tamanioFuente = Math.max(c.width, c.height) / 40;
        cxt.font = tamanioFuente + "px Arial";
        cxt.fillStyle = "white";
        cxt.fillText("Score: " + this.puntos, tamanioFuente / 2, c.height - tamanioFuente / 2);
    }
}
function convertirPosicion (x, y, tam){
    var coordenadas = {
        "x" : x * c.width / (tamanio.anchoElemento * 3),
        "y" : y * c.height / (tamanio.altoElemento * 3)
    }
    if(c.width < c.height){
        var aux = coordenadas.x;
        coordenadas.x = coordenadas.y;
        coordenadas.y = c.height - aux - tam;
    }
    return coordenadas;
}
function hVentana (porcentajeAlto) {
    return window.innerHeight * porcentajeAlto / 100;
}
function wVentana (porcentajeAncho) {
    return window.innerWidth * porcentajeAncho / 100;
}
function colocarLienzo () {
    if(window.innerWidth > window.innerHeight){
        tamanio = new TamanioRelativo(16,9,95);
    }
    else{
        tamanio = new TamanioRelativo(9,16,95);
    }
    tamanio.obtenerValores();

    c.width = tamanio.tamanioX;
    c.height = tamanio.tamanioY;
    c.style.left = tamanio.posicionX + "px";
    c.style.top = tamanio.posicionY + "px";

    cVisible.width = tamanio.tamanioX;
    cVisible.height = tamanio.tamanioY;
    cVisible.style.left = tamanio.posicionX + "px";
    cVisible.style.top = tamanio.posicionY + "px";
    dibujarLienzo();
}
function dibujarLienzo () {
    cxt.clearRect(0,0,c.width,c.height);
    serpiente.dibujar();
    cxtVisible.clearRect(0,0,cVisible.width,cVisible.height)
    cxtVisible.drawImage(c,0,0,c.width,c.height,0,0,cVisible.width,cVisible.height)
}
function actualizarLienzo () {
    serpiente.actualizar();
    if(serpiente.gameOver){
        serpiente = new Serpiente();
    }
    dibujarLienzo();
    setTimeout(actualizarLienzo,100);
}

serpiente = new Serpiente();
colocarLienzo();
actualizarLienzo();


window.addEventListener("resize", colocarLienzo);
window.addEventListener("keydown", function () {
    var direccion;
    switch (event.key) {
        case "ArrowLeft":
        case "a":
            direccion = DIRECCION.IZQUIERDA;
            break;
        case "ArrowRight":
        case "d":
        
            direccion = DIRECCION.DERECHA;
            break;
        case "ArrowUp":
        case "w":
            direccion = DIRECCION.ARRIBA;
            break;
        case "ArrowDown":
        case "s":
            direccion = DIRECCION.ABAJO;
            break;
        default:
            return;
    }
    if(c.width < c.height){
        switch (direccion) {
            case DIRECCION.IZQUIERDA:
                direccion = DIRECCION.ARRIBA;
                break;
            case DIRECCION.DERECHA:
                direccion = DIRECCION.ABAJO;
                break;
            case DIRECCION.ARRIBA:
                direccion = DIRECCION.DERECHA;
                break;
            case DIRECCION.ABAJO:
                direccion = DIRECCION.IZQUIERDA;
                break;
            default:
                break;
        }
    }
    if((serpiente.colaBotones.length == 0 && Math.abs(direccion) == Math.abs(serpiente.direccion)) || serpiente.colaBotones.length > 2 || Math.abs(direccion) == Math.abs(serpiente.colaBotones[0])
    ){
        return;
    }
    serpiente.colaBotones.unshift(direccion);
});