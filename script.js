const canvas=document.getElementById("canvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const ctx=canvas.getContext('2d');
const nctx = nextShapeCanvas.getContext("2d");
const sctx = scoreCanvas.getContext("2d");
const image=carre;
canvas.width=400;
canvas.height=800;
nextShapeCanvas.width=200;
nextShapeCanvas.height=200;
scoreCanvas.width=200;
scoreCanvas.height=200;
const imageSquareSize=24;
const size=40;
const framePerSecond=24;
const gameSpeed=3;
const squareCountX=canvas.width/size;
const squareCountY=canvas.height/size;
const btnPlay=play;
let gameMap;
let gameOver;
let currentShape;
let nextShape;
let score;
let initialTwoDArr;
let whiteLineThikness=4;
let isPlay=false;

class Tetris{
    constructor(imageX,imageY,template){
        this.imageX=imageX;
        this.imageY=imageY;
        this.template=template;
        this.x=squareCountX/2;
        this.y=0;
    }

          checkBottom(){
          for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
              if (this.template[i][j] == 0) continue;
              let realX = i + this.getTruncedPosition().x;
              let realY = j + this.getTruncedPosition().y;
              if (realY + 1 >= squareCountY) {
                return false;
              }
              if (gameMap[realY + 1][realX].imageX != -1) {
                return false;
              }
            }
          }
          return true;
          };


          getTruncedPosition() {
          return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
          };


          checkLeft(){
          for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
              if (this.template[i][j] == 0) continue;
              let realX = i + this.getTruncedPosition().x;
              let realY = j + this.getTruncedPosition().y;
              if (realX - 1 < 0) {
                return false;
              }

              if (gameMap[realY][realX - 1].imageX != -1) return false;
            }
          }

          return true;
          };

          checkRight(){
          for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
              if (this.template[i][j] == 0) continue;
              let realX = i + this.getTruncedPosition().x;
              let realY = j + this.getTruncedPosition().y;
              if (realX + 1 >= squareCountX) {
                return false;
              }

              if (gameMap[realY][realX + 1].imageX != -1) return false;
            }
          }

          return true;
          };

          moveLeft(){
          if (this.checkLeft()) {
            this.x -= 1;
          }
          };

          moveRight(){
          if (this.checkRight()) {
            this.x += 1;
          }
          };

          moveBottom(){
          if (this.checkBottom()) {
            this.y += 1;
          //  score += 1;
          }
          };

          changeRotation(){
          let tempTemplate = [];
          for (let i = 0; i < this.template.length; i++)
          tempTemplate[i] = this.template[i].slice();
          let n = this.template.length;
          for (let layer = 0; layer < n / 2; layer++) {
          let first = layer;
          let last = n - 1 - layer;
          for (let i = first; i < last; i++) {
            let offset = i - first;
            let top = this.template[first][i];
            this.template[first][i] = this.template[i][last]; // top = right
            this.template[i][last] = this.template[last][last - offset]; //right = bottom
            this.template[last][last - offset] =
              this.template[last - offset][first];
            //bottom = left
            this.template[last - offset][first] = top; // left = top
          }
          }

          for (let i = 0; i < this.template.length; i++) {
          for (let j = 0; j < this.template.length; j++) {
            if (this.template[i][j] == 0) continue;
            let realX = i + this.getTruncedPosition().x;
            let realY = j + this.getTruncedPosition().y;
            if (
              realX < 0 ||
              realX >= squareCountX ||
              realY < 0 ||
              realY >= squareCountY
            ) {
              this.template = tempTemplate;
              return false;
            }
          }
          }
          };


}

const shapes = [
  new Tetris(0, 120, [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ]),
  new Tetris(0, 96, [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]),
  new Tetris(0, 72, [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ]),
  new Tetris(0, 48, [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ]),
  new Tetris(0, 24, [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]),
  new Tetris(0, 0, [
    [1, 1],
    [1, 1],
  ]),

  new Tetris(0, 48, [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ]),
];


function deleteCompleteRows (){
for (let i = 0; i < gameMap.length; i++) {
let t = gameMap[i];
let isComplete = true;
for (let j = 0; j < t.length; j++) {
if (t[j].imageX == -1) isComplete = false;
}
if (isComplete) {
score += 100;
for (let k = i; k > 0; k--) {
gameMap[k] = gameMap[k - 1];
}
let temp = [];
for (let j = 0; j < squareCountX; j++) {
temp.push({ imageX: -1, imageY: -1 });
}
gameMap[0] = temp;
}
}
};

function update(){
if(gameOver) return;
if(currentShape.checkBottom()){
currentShape.y+=1
}else{
for (let k = 0; k < currentShape.template.length; k++) {
for (let l = 0; l < currentShape.template.length; l++) {
if (currentShape.template[k][l] == 0) continue;
gameMap[currentShape.getTruncedPosition().y + l][
  currentShape.getTruncedPosition().x + k
] = { imageX: currentShape.imageX, imageY: currentShape.imageY };
}
}
deleteCompleteRows();
currentShape=nextShape;
nextShape=getRandomShape();
if (!currentShape.checkBottom()) {
gameOver = true;
}
score += 10;
}
};


function drawRect(x,y,width,height,color){
ctx.fillStyle=color;
ctx.fillRect(x,y,width,height);

};

function drawBackground(){
drawRect(0,0,canvas.width,canvas.height,"#aca0dc");
for(let i=0;i<squareCountX+1;i++){
drawRect(size*i-whiteLineThikness,0,whiteLineThikness,canvas.height,"gray")
}

for(let i=0;i<squareCountY+1;i++){
drawRect(0,size*i-whiteLineThikness,canvas.width,whiteLineThikness,"gray")
}
};


function drawCurrentShape(){
for(let i=0;i<currentShape.template.length;i++){
for(let j=0;j<currentShape.template.length;j++){
      if(currentShape.template[i][j]==0) continue;
      ctx.drawImage(image,currentShape.imageX,currentShape.imageY,imageSquareSize,imageSquareSize,Math.trunc(currentShape.x)*size+size*i,Math.trunc(currentShape.y)*size+size*j,size,size)
}

}
};


function drawSquares(){
for (let i = 0; i < gameMap.length; i++) {
let t = gameMap[i];
for (let j = 0; j < t.length; j++) {
if (t[j].imageX == -1) continue;
ctx.drawImage(
  image,
  t[j].imageX,
  t[j].imageY,
  imageSquareSize,
  imageSquareSize,
  j * size,
  i * size,
  size,
  size
);
}
}
};

function drawNextShape(){
nctx.fillStyle = "#aca0dc";
nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
for (let i = 0; i < nextShape.template.length; i++) {
for (let j = 0; j < nextShape.template.length; j++) {
if (nextShape.template[i][j] == 0) continue;
nctx.drawImage(
image,
nextShape.imageX,
nextShape.imageY,
imageSquareSize,
imageSquareSize,
size * i,
size * j + size,
size,
size
);
}
}
};

function drawGameOver(){

ctx.font = "74px Bangers";
ctx.fillStyle = "black";
ctx.fillText("Game Over!", 55, canvas.height / 2);
};

function drawScore  ()  {
sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
sctx.fillStyle = "#aca0dc";
sctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);

sctx.font = "64px Bangers";
sctx.fillStyle = "black";
sctx.fillText(score, 10, 50);
};

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);
drawBackground();
drawSquares();
drawCurrentShape();
drawNextShape();
drawScore();
if(gameOver){
drawGameOver();
}
};

function getRandomShape(){
return Object.create(shapes[Math.floor(Math.random()*shapes.length)])
};


function resetVars(){
initialTwoDArr=[];
for(let i=0;i<squareCountY;i++){
let temp=[];
for(let j=0;j<squareCountX;j++){
      temp.push({imageX:-1,imageY:-1});
}
initialTwoDArr.push(temp);
}
score=0;
gameOver=false;
currentShape=getRandomShape();
nextShape=getRandomShape();
gameMap=initialTwoDArr;
};

function gameLoop(){
  setInterval(draw);
  btnPlay.addEventListener("click",()=>{
    isPlay=true;
    setInterval(update,1000/gameSpeed);
    setInterval(draw,1000/framePerSecond);
  })

};


window.addEventListener("keydown", (event) => {
  if(isPlay){
if (event.keyCode == 37) currentShape.moveLeft();
else if (event.keyCode == 38) currentShape.changeRotation();
else if (event.keyCode == 39) currentShape.moveRight();
else if (event.keyCode == 40) currentShape.moveBottom();

  }
});


resetVars();

gameLoop();
