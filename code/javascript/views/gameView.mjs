import * as Write from '../utils/write.mjs'
import * as GameConstants from '../utils/const.mjs'
import * as assets from '../assets.mjs'

const PLAYER = "M";
const PLATFORM = "_"
const EMPTY = " "
const DEAD = "X"

const UP = -1.1;
const DOWN = 1.1;
const LEFT = -1.1;
const RIGHT = 1.1;

const MAX_VY = DOWN * 2;

let currentLevel = 0;
let dificultyLevel = 0
let baseMap = [];
let playMap = ""
let level = null;
let bounds = null;

let gravity = 0.2
let lander = {row:0,col:0, vx:0,vy:UP, fuel:0}

let boost = false;

let elapsedTimeSinceLastUpdate = 0;
let refreshLimit = 80; 
let isGameOver = false;
let isLevelComplete = false;
let countdownValue =0;

const eventHandlers = {
    onChangeGameStateEventHandler:null
}

function ready(difLevel){
    dificultyLevel = difLevel || 0;
    resetForNewLevel();
}

function resetForNewLevel(){
    isGameOver = false;
    isLevelComplete = false;
    countdownValue = 0;
    currentLevel++;

    if(currentLevel < assets.LEVELS.length){
        level = assets.LEVELS[currentLevel];
        playMap = level.map
        lander.fuel = level.fuel;
        bounds = Write.strBounds(playMap)

        let sp = findStartPosition(playMap);
        lander.row = sp.row;
        lander.col = sp.col;
    
        playMap = playMap.replace(PLAYER, EMPTY);
        baseMap = playMap.split("\n");
        
        for(let i = 0; i < baseMap.length; i++){
            let row = baseMap[i].split("");
            baseMap[i] = row;
        }
    }
}

function update(keyStates, timeDelta){
    let dirty = false;
    
    elapsedTimeSinceLastUpdate += timeDelta;
    
    if(isGameOver){
        countdownValue -= timeDelta;
        if(countdownValue <= 0){
            eventHandlers.onChangeGameStateEventHandler(GameConstants.GAME_STATES.MENU,null);
        }
        return; 
    }

    if(isLevelComplete){
        countdownValue -= timeDelta;
        if(countdownValue <= 0){
            resetForNewLevel();
        }
        return;
    }


    if(keyStates.UP(false) || keyStates.DOWN()){
        if(keyStates.UP()){
            lander.vy += UP;
            boost = true;
        } else {
            lander.vy += DOWN;
            boost = true;
        }    
    }   
    
    if(keyStates.LEFT(false) || keyStates.RIGHT()){
        lander.vx += keyStates.LEFT() ? LEFT:RIGHT;
        boost = true;
    }

    if(boost){
        lander.fuel -= 0.1;
    }

    lander.vy = Math.min(lander.vy +  gravity, MAX_VY);

    let vYt = lander.vy;
    let vXt = lander.vx;
    let row = lander.row;
    let col = lander.col; 

    baseMap[row][col] = EMPTY;

    if(vYt > 1 ){
        row += 1;
    } else if (vYt < -1 && row > 0){
        row -= 1;
    }

    if(vXt > 1 && col < bounds.max-1){
        col += 1;
    } else if(vXt < -1 && col > 0){
        col -= 1;
    }

    if(baseMap[row][col] === EMPTY){
        baseMap[row][col] = PLAYER;
        lander.vx = vXt;
        lander.vy = vYt;
        lander.row = row;
        lander.col = col;
    } else {

        if(baseMap[row][col] === PLATFORM){
            baseMap[lander.row][lander.col] = EMPTY
            baseMap[row][col] = "⌂"
        } else{
            baseMap[lander.row][lander.col] = DEAD;
            isGameOver = true;
        }
    }

    
    if(elapsedTimeSinceLastUpdate >= refreshLimit){
        
        elapsedTimeSinceLastUpdate = 0;
        dirty = true;
        playMap = (baseMap.map(e => e.join(""))).join("\n")

    }
 
    return dirty;
}

function draw(dirty, timeDelta){

    Write.topCenter(`⛽️:${lander.fuel}  vx:${lander.vx.toPrecision(2)} vy:${lander.vy.toPrecision(2)}`);
    if(dirty){
       Write.centerd(playMap)
       if(isGameOver){
        Write.centerd(assets.GAMEOVER);
       }
    }
}


function findStartPosition(map){
    const mapSegements = map.split("\n");
    let row = -1;
    let col = -1;
    for (let i = 0; i < mapSegements.length; i++) {
        const segment = mapSegements[i];
        col = segment.indexOf(PLAYER);
        if(col !== -1){
            row = i
            break;
        }
    }

    if(row === -1 || col === -1){
        throw Error("Map does not contain starting position")
    }

    return {row,col}
}


export {
    ready,
    update,
    draw, 
    eventHandlers
}

