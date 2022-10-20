import { ANSI } from './ansi.mjs';

const CENTER = {
    row:Math.round(process.stdout.rows *0.5),
    column:Math.round(process.stdout.columns * 0.5)
}

const BOTTOM = process.stdout.rows;
const WIDTH = process.stdout.columns;


function calculateStringBounds(str) {

    str ||= "";

    const lines = str.split("\n");
    let minLineLength = str.length;
    let maxLineLength = 0;
    let height = lines.length;

    for (const line of lines) {
        const lenght = line.length
        if (lenght < minLineLength) {
            minLineLength = lenght;
        }
        if (lenght > maxLineLength) {
            maxLineLength = lenght;
        }
    }

    return { max: maxLineLength, min: minLineLength, height, width: maxLineLength }
}

function write (...text) {
    for(const t of text){
        process.stdout.write(t)
    }
}

function writeWithOffset(text,row,col){

    const lines = text.split("\n");
    let output = ANSI.moveCursorTo(row,0); 

    for(let i = 0; i < lines.length; i++){
        const line = lines[i];
        output = `${output}${ANSI.CURSOR_RIGHT.repeat(col)}${line}\n`;
    }
    
    write(output);
}

function writeCenterd(text){
    const textBounds = calculateStringBounds(text);
    const sr = CENTER.row - Math.round(textBounds.height * 0.5);
    const sc = CENTER.column - Math.round(textBounds.width * 0.5);    
    writeWithOffset(text,sr,sc)
}

function writeBottomLeft(text){
    const textBounds = calculateStringBounds(text);
    const sr = BOTTOM - textBounds.height
    const sc = 0
    writeWithOffset(text, sr,sc)
}

function writeBottomCenter(text){
    const textBounds = calculateStringBounds(text);
    const sr = BOTTOM - textBounds.height;
    const sc = CENTER.column - Math.round(textBounds.width *0.5);
    writeWithOffset(text, sr, sc)
}

function writeBottomRight(text){
    const textBounds = calculateStringBounds(text);
    const sr = BOTTOM - textBounds.height
    const sc = WIDTH - textBounds.max;
    writeWithOffset(text, sr,sc)
}

function writeCenterTop(text){
    const textBounds = calculateStringBounds(text);
    const sr = 0;
    const sc = CENTER.column - Math.round(textBounds.width *0.5);
    writeWithOffset(text, sr, sc)
}


function clear() {
    write(ANSI.DELETE_SCREEN, ANSI.CURSOR_HOME, ANSI.RESTORE_CURSOR);
}

function whipeScreenClean(){
    write(ANSI.CLEAR_SCREEN);
    clear();
}

export { whipeScreenClean, clear,write as write, writeWithOffset as withOffsett, writeCenterd as centerd,writeCenterTop as topCenter,  writeBottomLeft as bottomLeft, writeBottomCenter as bottomCenter, writeBottomRight as bottomRight, CENTER as SCREEN_CENTER, BOTTOM as SCREEN_HEIGHT, WIDTH as SCREEN_WIDTH, calculateStringBounds as strBounds}