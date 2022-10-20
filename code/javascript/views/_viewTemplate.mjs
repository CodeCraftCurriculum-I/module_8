import * as Write from '../utils/write.mjs'
import * as GameConstants from '../utils/const.mjs'

const eventHandlers = {
    onChangeGameStateEventHandler:null
}

function ready(){
    // Prepear the module for use. 
}

function update(keyStates, timeDelta){
    let dirty = false; 
    // View logick... 
    return dirty;
}

function draw(dirty, timeDelta){
    if(dirty){
       // Update screen
    }
}

export {
    ready,
    update,
    draw, 
    eventHandlers
}

