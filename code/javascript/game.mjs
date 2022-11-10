import sdl from '@kmamal/sdl'
import { loadImage, createCanvas } from 'canvas';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const GAME_TITLE = "Astroids";
const WINDOW_WIDTH = 480;
const WINDOW_HEIGHT = 320;
const MAX_VELOCITY = 5;

let gameover = false

const KEYS = {
    QUIT:20,
    LEFT:80,
    RIGHT:79,
    UP:82,
    DOWN:81,
    SPACE:44,
}

const ASSETS = {
    METEOR: {
        large: await loadImage('assets/meteorL.png'),
        smal: await loadImage('assets/meteorS.png')
    },
    SPACESHIP: await loadImage('assets/spaceship.png')
}

const player = {
    angle:0,
    velocity:0,
    x:0,
    y:0,
}

let meteor = null;

function update(dt) {
    
    const state = sdl.keyboard.getState();

    if (state[KEYS.QUIT]) {
        console.log("Exit game");
        window.destroy();
    }

    if(state[KEYS.LEFT]){
        player.angle -= 2;
    }

    if(state[KEYS.RIGHT]){
        player.angle += 2;
    }

    if(state[KEYS.UP]){
        player.velocity++;
    }

    if(state[KEYS.DOWN]){
        player.velocity--;
    }

    // Meteor 

    if(meteor == null && Math.random()<= 0.02 ){
        meteor = {
            graphics: ASSETS.METEOR.large,
            size:"Large",
            x:Math.round(Math.random() * WINDOW_WIDTH),
            y:Math.round(Math.random() * WINDOW_HEIGHT),
            velocity: clamp(Math.random() * MAX_VELOCITY,1,MAX_VELOCITY),
            angle:Math.round(Math.random()*360) 
        }
    }else if(meteor) {
        const dx = Math.cos(meteor.angle * (Math.PI/180)) * meteor.velocity; 
        const dy = Math.sin(meteor.angle * (Math.PI/180)) * meteor.velocity;
        meteor.x += dx;
        meteor.y += dy;

        if(meteor.x > WINDOW_WIDTH){
            meteor.x = -12;
        } else if(meteor.x <0){
            meteor.x = WINDOW_WIDTH - 12;
        }
        if(meteor.y > WINDOW_HEIGHT){
            meteor.y = 12;
        } else if(meteor.y < 0){
            meteor.y = WINDOW_HEIGHT - 12;
        }

    }

    // Player
    player.velocity = clamp(player.velocity,0,MAX_VELOCITY);

    let dx = Math.cos(player.angle * (Math.PI/180)) * player.velocity; 
    let dy = Math.sin(player.angle * (Math.PI/180)) * player.velocity;

    player.x += dx;
    player.y += dy;

    if(player.x > WINDOW_WIDTH){
        player.x = -12;
    } else if(player.x <0){
        player.x = WINDOW_WIDTH - 12;
    }
    if(player.y > WINDOW_HEIGHT){
        player.y = 12;
    } else if(player.y < 0){
        player.y = WINDOW_HEIGHT - 12;
    }

    if(meteor){
        dx = player.x - meteor.x;
        dy = player.y - meteor.y;
        const distance = Math.sqrt((dx*dx) + (dy*dy));
        if(distance <= 12){
           meteor.graphics = ASSETS.METEOR.smal;
        }
    }
}

function draw(dt, ctx, canvas, window) {

    if(gameover) return;

    const { width, height } = window;
    
    ctx.clearRect(0,0,width,height); // -> Visk ut arket. 

    ctx.save();
    ctx.translate(player.x,player.y);
    ctx.rotate((player.angle +90) * (Math.PI/180))
    ctx.drawImage(ASSETS.SPACESHIP, -12, -12, 24, 24);
    ctx.restore();

    if(meteor){
        ctx.save();
        ctx.translate(meteor.x,meteor.y)
        ctx.rotate((meteor.angle ) * (Math.PI/180))
        ctx.drawImage(meteor.graphics, -12, -12, 24, 24);
        ctx.restore();
    }

    const gameView = canvas.toBuffer('raw')
    window.render(width, height, width * 4, 'bgra32', gameView)
}

function calculateFPS(dt) {

    if (calculateFPS.instance == undefined) {
        calculateFPS.instance = true;
        calculateFPS.fps = 0;
        calculateFPS.dt = 0;
        calculateFPS.frames = 0;
    }

    calculateFPS.dt += dt;
    calculateFPS.frames++;

    if (calculateFPS.dt >= 1000) {
        calculateFPS.fps = Math.round(calculateFPS.frames / (calculateFPS.dt / 1000));
        calculateFPS.frames = 0;
        calculateFPS.dt = 0;
    }

    return calculateFPS.fps;
}


function start() {

    let prev = Date.now()
    let now = prev;

    const canvas = createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT)
    const ctx = canvas.getContext('2d');
    
    const window = sdl.video.createWindow({ resizable: false, title: GAME_TITLE, width: WINDOW_WIDTH, height: WINDOW_HEIGHT })

    //window.on("keyDown", (e)=>{ console.log(e);});

    player.x = (WINDOW_WIDTH * 0.5) - 12;
    player.y = (WINDOW_HEIGHT * 0.5) - 12;

    const interval = setInterval(() => {
        if (window.destroyed) {
            clearInterval(interval)
            return
        }

        now = Date.now();
        const dt = now - prev;

        update(dt);
        draw(dt, ctx, canvas, window);
        const fps = calculateFPS(dt);
        window.setTitle(`${GAME_TITLE}  FPS:${fps}`)

        prev = now;

    }, 1000 / 30);

}

start();

