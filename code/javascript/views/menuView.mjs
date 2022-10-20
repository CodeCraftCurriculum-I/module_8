import { ANSI } from '../utils/ansi.mjs';
import * as gameAssets from '../assets.mjs'
import * as Write from '../utils/write.mjs'
import * as GameConstants from '../utils/const.mjs'

const BASE_MENU = GameConstants.GAME_DIFICULTY_LEVELS.join("\n");
let menu = "";
let activeMenuIndex = 0
let menuStartRow = 0; 
let menuStartCol = 0;

const eventHandlers = {
    onChangeGameStateEventHandler:null
}

function ready(){
    activeMenuIndex = 0;
    menu = "";
}

function update(keyStates,timeDelta){

    let dirty = menu.length === 0 ? true:false;
    
    if(keyStates.UP() && activeMenuIndex > 0){
        activeMenuIndex --;
        dirty = true;
    } else if (keyStates.DOWN() && activeMenuIndex < 1){
        activeMenuIndex ++;
        dirty = true;
    }

    if (keyStates.ACTION()){
        eventHandlers.onChangeGameStateEventHandler(GameConstants.GAME_STATES.PLAY, activeMenuIndex)
    }

    if(dirty){
        menu = "";
        let nonRichMenu = "" 

        let tempMen = BASE_MENU.split("\n");
        for(let i = 0; i < tempMen.length; i++){
            nonRichMenu = `${nonRichMenu}  ${tempMen[i]}\n`;
            if(i === activeMenuIndex){
                menu = `${menu}${ANSI.COLOR.GREEN}> ${tempMen[i]}${ANSI.COLOR_RESET}\n`;
            } else {
                menu = `${menu}  ${tempMen[i]}\n`
            }
        }
    
        const menuBounds = Write.strBounds(nonRichMenu);
        menuStartRow = Write.SCREEN_CENTER.row + 4;
        menuStartCol = Write.SCREEN_CENTER.column - Math.round(menuBounds.width * 0.5);
    }

    return dirty;
}

function draw(dirty, timeDelta){
    if(dirty){
        Write.centerd(gameAssets.LOGO);
        Write.withOffsett(menu,menuStartRow, menuStartCol);
        Write.bottomCenter("Press SPACE to play, q to quit");
    }
}

export {
    ready,
    update,
    draw, 
    eventHandlers
}

