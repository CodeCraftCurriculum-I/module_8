import * as readline from "node:readline"

const KEY_MAP = {
    ACTION: ["space", "return"],
    QUIT: ["escape", "q"],
    UP: ["up", "w"],
    DOWN: ["down", "s"],
    LEFT: ["left", "a"],
    RIGHT: ["right", "d"]
};

const KEY_STATUS = createStatusMapFromKeys(KEY_MAP);
const KEYS = createActionHandlerFromKeys(KEY_MAP);

function createActionHandlerFromKeys(keyMap) {

    const actionHandler = {}

    for (let keyID in keyMap) {
        const lookupKeys = keyMap[keyID];
        actionHandler[keyID] = (reset) => {
            return readKeyState(lookupKeys, reset);
        }
    }

    return actionHandler;
}

function createStatusMapFromKeys(keyMap) {
    const statusMap = {}

    for (let keyID in keyMap) {
        const lookupKeys = keyMap[keyID];
        for (let key of lookupKeys) {
            statusMap[key] = false;
        }
    }

    return statusMap;
}

function readKeyState(keys, resetAfterRead) {
    resetAfterRead = resetAfterRead === false ? false:true;
    let isPressed = false;

    for (let i = 0; i < keys.length; i++) {
        let keyName = keys[i];
         isPressed = isPressed || KEY_STATUS[keyName];
        if (isPressed && resetAfterRead) {
            KEY_STATUS[keyName] = false;
        }
    }
    return isPressed;
}

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

process.stdin.on("keypress", (str, key) => {
    if (KEY_STATUS.hasOwnProperty(key.name)) {
        KEY_STATUS[key.name] = true;
    }
});

export { KEYS }