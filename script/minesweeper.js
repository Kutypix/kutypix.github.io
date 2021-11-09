var buttons = document.querySelectorAll(".button");
var menu = document.getElementById("menu");
var gameSection = document.getElementById("gameSection");
var rulesSection = document.getElementById("rulesSection");
var fameSection = document.getElementById("fameSection");
var board = document.getElementById("board");
var playground = document.getElementById("playground");
var info = document.getElementById("info");
var emoji = document.getElementById("emoji");

var backRules = document.getElementById("backRules");
var backGame = document.getElementById("backGame");
var backFame = document.getElementById("backFame");

var customWidth = document.getElementById("customWidth");
var customHeight = document.getElementById("customHeight");
var customMines = document.getElementById("customMines");

var countHundreds2 = document.getElementById("hundreds2");
var countDozens2 = document.getElementById("dozens2");
var countUnity2 = document.getElementById("unity2");

var countHundreds1 = document.getElementById("hundreds1");
var countDozens1 = document.getElementById("dozens1");
var countUnity1 = document.getElementById("unity1");

let tab = []; // bombs 
let width, height, mines, mode, posx, posy, countToWin;
let isGameOn = true;

document.getElementsByTagName("html")[0].addEventListener("contextmenu", function(e){
    e.preventDefault();
    return false;
})
//================== Board creation function & clicking mechanism ==================

function creatBoard(width,height){
    let firstClick = true;
    for(let i=0;i<height;i++){
        tab[i]=[];
        for(let j=0;j<width;j++){
            let div = document.createElement("div");
            tab[i][j] = { isBomb: false, isFlag: false, number: 0, div, isClicked: false }
            div.style.left = j*25+"px";
            div.style.top = i*25+"px";
            div.classList.add("field");
            board.appendChild(div);
            div.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                if(isGameOn==true && tab[i][j].isClicked==false)
                {
                    if(tab[i][j].isFlag ==false)
                    {
                        tab[i][j].isFlag = true;
                        div.style.backgroundImage = "url('../img/minesweeper/tiles/flag.png')";
                    }
                    else
                    {
                        tab[i][j].isFlag = false;
                        div.style.backgroundImage = "url('../img/minesweeper/tiles/field.png')";
                    }
                    emoji.style.backgroundImage = "url('../img/minesweeper/other/smile.png')"; 
                }
            });
            div.addEventListener("mousedown",function(){
                if(isGameOn==true)
                    emoji.style.backgroundImage = "url('../img/minesweeper/other/hushed.png')";
            });
            div.addEventListener("mouseup",function(){
                if(isGameOn==true)
                    emoji.style.backgroundImage = "url('../img/minesweeper/other/smile.png')";
            });
            div.addEventListener("click",function(){
                if(isGameOn==true && tab[i][j].isFlag==false) 
                {
                    if(firstClick){
                        doMines(i, j);
                        timer();
                        firstClick = false;
                    }
                    if(tab[i][j].isBomb==false){
                        // dfs
                        let stack = [];
                        if (tab[i][j].isClicked==false) {
                            stack = [{i,j}]
                        }
                        while(stack.length>0){
                            const {i:ci,j:cj} = stack.pop();
                            for (let oi = -1; oi <= 1; oi++)
                                for (let oj = -1; oj <= 1; oj++) {
                                    if (ci + oi < 0 || ci + oi >= height) continue;
                                    if (cj + oj < 0 || cj + oj >= width) continue;
                                    const current = tab[ci + oi][cj + oj];
                                    if (current.isBomb || current.isFlag || current.isClicked) continue;
                                    current.isClicked = true;
                                    countToWin --;
                                    if (current.number > 0) {
                                        current.div.style.backgroundImage = `url('../img/minesweeper/numbers/${current.number}.png')`
                                        continue;
                                    }
                                    current.div.style.backgroundImage = "url('../img/minesweeper/tiles/clickedField.png')";     
                                    stack.push({i: ci + oi, j: cj + oj});
                                }
                        }
                        if(countToWin==0)
                        {
                            clearInterval(interval);
                            isGameOn = false;
                            emoji.style.backgroundImage = "url('../img/minesweeper/other/glasses.png')";
                            alert("You won!");
                        }             
                    }
                    else
                    {
                        clearInterval(interval);
                        for(let x=0;x<height;x++)
                            for(let y=0;y<width;y++)
                            {
                                if(tab[x][y].isBomb== true && tab[x][y].isFlag == true)
                                    tab[x][y].div.style.backgroundImage = "url('../img/minesweeper/tiles/flag.png')";
                                else if(tab[x][y].isFlag!= false)
                                    tab[x][y].div.style.backgroundImage = "url('../img/minesweeper/tiles/wrongMine.png')";
                                else if(tab[x][y].isBomb== true)
                                    tab[x][y].div.style.backgroundImage = "url('../img/minesweeper/tiles/mine.png')";
                            }
                        div.style.backgroundImage = "url('../img/minesweeper/tiles/clickedMine.png')";
                        emoji.style.backgroundImage = "url('../img/minesweeper/other/sad.png')";
                        isGameOn = false;
                    }
                }
            });
        }
    }
    board.style.display = "block";
}
//================== Menu interaction ==================

buttons.forEach(click);
function click(item, index){
    item.addEventListener("click", function(){
        //console.log("Hello I am button nr: "+index)
        switch(index){
            //================== Play ==================
            case 0:{
                menu.style.display = "none";
                gameSection.style.display = "block";
                break;
            }
            //================== Rules ==================
            case 1:{
                menu.style.display = "none";
                rulesSection.style.display = "block";
                break;
            }
            //================== Hall of fame ==================
            case 2:{
                menu.style.display = "none";
                fameSection.style.display = "block";
                break;
            }
            //================== Beginner ==================
            case 3:{
                mode = "Beginner"             
                gameSection.style.display = "none";
                mines = 10;
                width = 8;
                height = 8;
                creatBoard(width,height);
                countHundreds1.src = "../img/minesweeper/timer/0.png";
                countDozens1.src = "../img/minesweeper/timer/1.png";
                countUnity1.src = "../img/minesweeper/timer/0.png";
                board.style.width = "202px";
                board.style.height = "202px";
                playground.style.display = "block";
                info.style.width = "200px"
                break;
            }
            //================== Intermediate ==================
            case 4:{
                mode = "Intermediate"
                gameSection.style.display = "none";
                mines = 40;
                width = 16;
                height = 16;
                creatBoard(width,height);
                countHundreds1.src = "../img/minesweeper/timer/0.png";
                countDozens1.src = "../img/minesweeper/timer/4.png";
                countUnity1.src = "../img/minesweeper/timer/0.png";
                board.style.width = "402px";
                board.style.height = "402px";
                playground.style.display = "block";
                info.style.width = "400px"
                break;
            }
            //================== Expert ==================
            case 5:{
                mode = "Expert"
                gameSection.style.display = "none";
                mines = 99;
                countHundreds1.src = "../img/minesweeper/timer/0.png";
                countDozens1.src = "../img/minesweeper/timer/9.png";
                countUnity1.src = "../img/minesweeper/timer/9.png";
                width = 30;
                height = 16;
                creatBoard(width,height);
                board.style.width = "752px";
                board.style.height = "402px";
                playground.style.display = "block";
                info.style.width = "750px"
                break;
            }
            //================== Custom ==================
            case 6:{
                mode = "Custom";
                width = customWidth.value;
                height = customHeight.value;
                mines = customMines.value;
                countHundreds1.src = "../img/minesweeper/timer/"+Math.floor(mines/100)+".png";
                countDozens1.src = "../img/minesweeper/timer/"+Math.floor(mines/10%10)+".png";
                countUnity1.src = "../img/minesweeper/timer/"+mines%10+".png";
                if(width>=8 && width<=30 && height>=8 && height<=24 && mines>=10 && mines<=(width-1)*(height-1))
                {
                    creatBoard(width,height);
                    board.style.width = width*25+2+"px";
                    board.style.height = height*25+2+"px";
                    playground.style.display = "block";
                    info.style.width = width*25+"px";
                    gameSection.style.display = "none";
                }
                else
                    alert("Wrong params!");
                break;
            }
        }
        countToWin = (width*height)-mines;
    })
}
backRules.addEventListener("click",function(){
    menu.style.display = "block";
    rulesSection.style.display = "none";
})

backGame.addEventListener("click",function(){
    menu.style.display = "block";
    gameSection.style.display = "none";
})

backFame.addEventListener("click",function(){
    menu.style.display = "block";
    fameSection.style.display = "none";
})

//================== Timer function ==================

const maxTime = 999;
let interval, time;

function timer(){
    const start = new Date().getTime();
    interval = setInterval(function(){
        const now = new Date().getTime();
        const seconds = Math.floor((now - start)/1000);
        time = seconds;
        if(seconds==maxTime)
            clearInterval(interval);
        countUnity2.src = `../img/minesweeper/timer/${seconds%10}.png`;
        countDozens2.src = `../img/minesweeper/timer/${Math.floor(seconds/10)%10}.png`;
        countHundreds2.src = `../img/minesweeper/timer/${Math.floor(seconds/100)%10}.png`;
    },100)
}

//================== Mine generation function ==================

function updateNeighbours(y, x, value){
    for(let j = -1; j <= 1; j++)
        for(let k = -1; k <= 1; k++)
            if(x + j >= 0 && x + j < width && y + k >= 0 && y + k < height)
                tab[y+k][x+j].number += value;
}

function doMines(i, j){
    const empty = [];
    for(let x=0;x<width;x++)
        for(let y=0;y<height;y++)
            if (i != y && j != x)
                empty.push({x,y})
    for (let i = 0; i < mines; i++){
        const {x,y} = empty.popRandom();
        tab[y][x].isBomb = true;
        updateNeighbours(y,x,1);
        console.log("mine num: "+(i+1)+" position x: "+x+" position y: "+y);
    }
    return empty;
}

//================== Face function ==================

emoji.addEventListener("click",function(){
    clearInterval(interval);
    countUnity2.src = "../img/minesweeper/timer/0.png";
    countDozens2.src = "../img/minesweeper/timer/0.png";
    countHundreds2.src = "../img/minesweeper/timer/0.png";
    emoji.style.backgroundImage = "url('../img/minesweeper/other/smile.png')";
    firstClick = true;
    isGameOn = true;
    creatBoard(width,height);
    countToWin = (width*height)-mines;
});

Array.prototype.popRandom = function(){
    const index = Math.round(Math.random()*(this.length-1));
    const value = this[index];
    this.splice(index,1);
    return value;
}