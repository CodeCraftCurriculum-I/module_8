import { ANSI } from './utils/ansi.mjs';
import * as constants from './utils/const.mjs'
import * as Write from './utils/write.mjs'
import * as IO from './utils/io.mjs'
import * as gameMenuView from './views/menuView.mjs'
import * as gamePlayView from './views/gameView.mjs'

const GAME_STATES = constants.GAME_STATES

const gameStateHandlers = {};
gameStateHandlers[`${GAME_STATES.MENU}`] = gameMenuView;
gameStateHandlers[`${GAME_STATES.PLAY}`] = gamePlayView;

let gameLoop = null;
let gameState = GAME_STATES.IDLE;
let previous = 0;
let dirty = true;

function initalizeGame() {
    Write.write(ANSI.CLEAR_SCREEN, ANSI.HIDE_CURSOR, ANSI.GRAPHICS_MODE);

    gameMenuView.eventHandlers.onChangeGameStateEventHandler = changeToGameView;
    gameMenuView.ready();

    gamePlayView.eventHandlers.onChangeGameStateEventHandler = changeToMenuView;

    gameState = GAME_STATES.MENU;
    gameLoop = setInterval(loop, 250);
}

function changeToMenuView(nextGameState, ...params){
    Write.whipeScreenClean();
    gameMenuView.ready();
    gameState = nextGameState;
}

function changeToGameView(nextGameState, ...params){
    Write.whipeScreenClean();
    let dificultyLevel = params[0];
    gamePlayView.ready(dificultyLevel); 
    gameState = nextGameState;
}

function loop() {
    let now = Date.now();
    let dt = now - previous;

    dirty = update(IO.KEYS, dt);
    draw(dirty,dt);
    previous = now;
}

function update(keyStates, timeDelta) {
    
    if (keyStates.QUIT()) { exit(); }
   
    if (gameStateHandlers[gameState] !== undefined) {
       return gameStateHandlers[gameState].update(keyStates,timeDelta)
    }
    return false;
}

function draw(dirty, timeDelta) {

    if (dirty) {
        Write.clear();
    }

    if (gameStateHandlers[gameState] !== undefined) {
        gameStateHandlers[gameState].draw(dirty,timeDelta)
    }
}

function exit() {
    process.stdout.write(ANSI.CLEAR_SCREEN + ANSI.CURSOR_HOME + ANSI.SHOW_CURSOR + ANSI.RESET + ANSI.RESTORE_CURSOR);
    process.exit(0);
}

initalizeGame();