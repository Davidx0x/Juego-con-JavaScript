const canvas = document.querySelector('#game');

const game = canvas.getContext('2d');
let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined, 
}
const giftPosition = {
    x: undefined,
    y: undefined, 
}
let enemyPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

btnUp = document.querySelector('#up');
btnleft = document.querySelector('#left');
btnright = document.querySelector('#right');
btndown = document.querySelector('#down');
spanLives = document.querySelector('#lives');
spanRecord = document.querySelector('#spanRecord');
presult = document.querySelector('#presult');

btnUp.addEventListener('click', moveUp);
btnleft.addEventListener('click', moveleft);
btnright.addEventListener('click', moveRight);
btndown.addEventListener('click', moveDown);
window.addEventListener('keydown', move);



function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    }else{
        canvasSize = window.innerHeight * 0.8;
    }
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    elementsSize = Math.floor((canvasSize / 10) - 2);

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = '';
    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }
    const mapRows = map.trim().split('\n');
    const mapRowsCols = mapRows.map(row => row.trim().split(''));
    showLives()
    enemyPositions = [];
    game.clearRect(0,0, canvasSize, canvasSize);

    mapRowsCols.forEach((row, rowI) => {
        row.forEach((col, colI) =>{
            const emoji = emojis[col];
            const posX = elementsSize * (colI);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log(playerPosition); 
                }  
            }else if (col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
                console.log(playerPosition);   
            }else if(col == 'X'){
                enemyPositions.push({
                    x: posX,
                    y: posY,
                });
            }

            game.fillText(emoji, posX, posY);
        })
    });
    movePlayer();
    return;
}


function moveUp() {
    console.log('arriba');
    console.log((elementsSize - playerPosition.y))
    console.log(elementsSize)
    if (Math.floor(playerPosition.y - elementsSize) < elementsSize){
        console.log('OUT');
    }else{
        playerPosition.y -= elementsSize;
        startGame();
    }
}
function moveleft() {
    console.log('izquierda');
    console.log((elementsSize - playerPosition.x))
    console.log(elementsSize)
    if ((playerPosition.x - elementsSize) < 0){
        console.log('OUT');
        console.log((elementsSize - playerPosition.x))
    }else{
        playerPosition.x -= elementsSize;
        startGame();
    }
}
function moveRight() {
    console.log('Derecha');
    console.log((elementsSize - playerPosition.x))
    console.log(elementsSize)
    if ((playerPosition.x + elementsSize) > (canvasSize - 50)){
        console.log('OUT');
    }else{
        playerPosition.x += elementsSize;
        startGame();
    }
}
function moveDown() {
    console.log('abajo');
    if ((playerPosition.y + elementsSize) > canvasSize){
        console.log('OUT');
    }else{
        playerPosition.y += elementsSize;
        startGame();
    }
}

function move(e) {
    if (e.key == 'ArrowUp') {
        console.log("arribaaa");
        if (Math.floor(playerPosition.y - elementsSize) < elementsSize){
            console.log('OUT');
        }else{
            playerPosition.y -= elementsSize;
            startGame();
        }
    }else if (e.key == 'ArrowLeft') {
        console.log("izquiera");
        console.log((elementsSize - playerPosition.x))
        console.log(elementsSize)
        if ((playerPosition.x - elementsSize) < 0){
            console.log('OUT');
            console.log((elementsSize - playerPosition.x))
        }else{
            playerPosition.x -= elementsSize;
            startGame();
        }
    }else if (e.key == 'ArrowRight') {
        console.log('Derecha');
        console.log((elementsSize - playerPosition.x))
        console.log(elementsSize)
        if ((playerPosition.x + elementsSize) > (canvasSize - 50)){
            console.log('OUT');
        }else{
            playerPosition.x += elementsSize;
            startGame();
        }
    }else if (e.key == 'ArrowDown') {
        console.log('abajo');
        if ((playerPosition.y + elementsSize) > canvasSize){
            console.log('OUT');
        }else{
            playerPosition.y += elementsSize;
            startGame();
        }
    }
}

function movePlayer() {
    const giftCollisionX = playerPosition.x ==  giftPosition.x;
    const giftCollisionY = playerPosition.y == giftPosition.y;
    const collisionGift = giftCollisionX && giftCollisionY;
    if (collisionGift){
        level++;
        console.log(level);
        startGame();
        //levelWin();
    }
    const enemyColision = enemyPositions.find(enemy => {
        const enemyColisionX = enemy.x == playerPosition.x;
        const enemyColisiony = enemy.y == playerPosition.y;
        return enemyColisionX && enemyColisiony;
    });

    if (enemyColision) {
        console.log('chocaste');
        levelFail();
    }
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('subiste de nivel');
    console.log(level);
    level++;
    startGame();   
}

function gameWin() {
    console.log('termino el juego');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('recordTime');
    const playerTime = Math.floor((Date.now() - timeStart)/1000);
    if(recordTime){
        if(recordTime >= playerTime){
            localStorage.setItem('recordTime', playerTime);
           presult.innerHTML = 'SUPERASTE EL RECORD';
        }else{
            presult.innerHTML = 'No superaste el record :(';
        }
    }else{
        localStorage.setItem('recordTime', playerTime);
        presult.innerHTML = 'Nuevo Record: ';
    }

    console.log({recordTime,playerTime});
}

function levelFail() {
    lives--;

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    console.log('perdiste');
    console.log(lives);
    startGame();
}

function showLives(){
    spanLives.innerHTML = emojis['HEART'].repeat(lives);
}

function showTime() {
    spanTime.innerHTML = Math.floor((Date.now() - timeStart)/100);
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('recordTime');
}

