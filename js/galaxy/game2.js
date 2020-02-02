var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var debug = true;







// var hintergrundbild = new Image();

var gameInterval;
var ticks = 0;
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;
var lastShot = new Date;
// Liste aller beteiligter Objekte (Schiff, Gegner etc)
var actors = [];

var held = { left: false, right: false, up: false, down: false, fire: false };

var groessen = {
    canvas: {
        w: 0,
        h: 0
    },
    tile: { // size of tiles
        source: { w: 16, h: 16 },
        target: { w: 32, h: 32 }
    },
    tiles: { // number of tiles
        target: { w: 1, h: 1 } // this is set dynamically depending on the canvas size
    },
}

spieler = {
    pos: { x: 0, y: 0 },
    sprite: { x: 0, y: 32 },
    source_size: { w: 32, h: 32 },
    target_size: { w: 42, h: 42 },
    speed: { x: 0, y: 0 },
    spriteMap: new Image,
    lives: 3
};
var game_tiles = new Image;

var speed = {
    spaceship: {
        velocity_x: 5,
        velocity_y: 5,
    },
    lasershot: {
        velocity_x: 0,
        velocity_y: - 15
    }
}

function vorbereitungen() {
    console.log('Bereite alles vor!');
    hintergrundbild.src = 'themes/galaxy/simple/images/hintergrund2.png'

    if (debug) {
        window.addEventListener('mousemove', writeMousePos, false);
    }
    berechneDimensionen();
    starteSpieler();
    zeichneBild();
    starteSpiel();
}

function gameLoop() {
    updateTick();
    
    checkCollision();  // todo
    bewegeSpieler();  // prüfe Spieler Interaktionen

    pruefeGegnerStatus();
    berechneObjektpositionen();

    berechneActorAktionen();

    zeichneBild();


    // updateCharacters();
    // berechneSpielerposition();
    /// berechneActorPositionen();
    // console.log(ticks);
    // console.log(held);
    // zeichneBild();
}

/**
 * basic function for tick 
 */
function updateTick(){
    ticks++

    var thisFrameTime = (thisLoop = new Date) - lastLoop;
    frameTime += (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}

/**
 *  prüfen ob Schiffe getroffen werden
 *  TODO
 */
function checkCollision(){

}

/**
 * mach etwas, wenn der Spieler eine Taste drückt
 */
function bewegeSpieler(){
    spieler.speed.x = 0;
    spieler.speed.y = 0;
    if (held.left) {
        spieler.speed.x = -speed.spaceship.velocity_x;
    }
    if (held.right) {
        spieler.speed.x = speed.spaceship.velocity_x;
    }
    if (held.up) {
        spieler.speed.y = -speed.spaceship.velocity_y;
    }
    if (held.down) {
        spieler.speed.y = speed.spaceship.velocity_y;
    }
    if (held.fire) {
        held.fire = false;
        fireShot();
    }
}

function pruefeGegnerStatus(){
    for(var i = enemyActors.length - 1; i > 0; i++){
        var e = enemyActors[i];

        if(e.remove){
            enemyActors.splice(i,1);
        }

        if(e.status == 0){
            
        }
    }

    if(enemyActors.length == 0){
        // get next wave
    }
}

function berechneObjektpositionen(){
    //
}

function berechneActorAktionen(){

}

function berechneSpielerposition() {
    spieler.pos.x += spieler.speed.x;
    spieler.pos.y += spieler.speed.y;

    if (spieler.pos.x < 0)
        spieler.pos.x = 0;
    if (spieler.pos.x > groessen.canvas.w)
        spieler.pos.x = groessen.canvas.w;

    if (spieler.pos.y < 0)
        spieler.pos.y = 0;
    if (spieler.pos.y > (groessen.canvas.h - 64))
        spieler.pos.y = groessen.canvas.h - 64;
}

function berechneActorPositionen() {
    actors.forEach(function (actor) {
        if (actor.name) {
            if (actor.isDelete)
                return;
            actor.modifySpeed();
            actor.pos.x += actor.speed.x
            actor.pos.y += actor.speed.y

            if (actor.pos.y < -1000 || actor.pos.x > groessen.canvas.x + 1000) {
                actor.isDelete = true;
            }
        }
    })
}

function zeichneBild() {
    ctx.clearRect(0, 0, groessen.canvas.w, groessen.canvas.h);

    // zeichne spieler raumschiff
    actors.forEach(function (actor) {
        if (actor.name) {
            var img = new Image();
            img.src = 'themes/galaxy/simple/images/game_tiles.png';
            ctx.drawImage(
                img,
                actor.sprite.x,
                actor.sprite.y,
                actor.source_size.w,
                actor.source_size.h,
                actor.pos.x,
                actor.pos.y,
                actor.target_size.w,
                actor.target_size.h
            );
        } else {
            ctx.drawImage(
                actor.spriteMap,
                actor.sprite.x,
                actor.sprite.y,
                actor.source_size.w,
                actor.source_size.h,
                actor.pos.x,
                actor.pos.y,
                actor.target_size.w,
                actor.target_size.h
            );
        }

    });
}

function fireShot() {
    var now = new Date;
    if ((lastShot - now) > 1000)
        return;

    lastShot = now;
    console.log(now);
    var ls = new Lasershot();
    ls.pos.x = spieler.pos.x;
    ls.pos.y = spieler.pos.y;
    ls.spriteMap.src = 'themes/galaxy/simple/images/game_tiles.png';

    actors.push(ls)
}


function berechneDimensionen() {
    var browser_w = document.documentElement.clientWidth
    var browser_h = document.documentElement.clientHeight
    groessen.canvas.w = browser_w - 4
    groessen.canvas.h = browser_h - 4
    canvas.width = groessen.canvas.w
    canvas.height = groessen.canvas.h
    groessen.tiles.target.w = groessen.canvas.w / groessen.tile.target.w
    groessen.tiles.target.h = groessen.canvas.h / groessen.tile.target.h
    // if the canvas is not high enough, cut from the upper side, if it's too high, move down
    //line_offset_y = groessen.canvas.h / groessen.tile.target.h - current_level.level.length
}

function writeMousePos(pos) {
    console.log(pos.x + ' / ' + pos.y);
    console.log(groessen);
}

function starteSpieler() {
    spieler.spriteMap.src = 'themes/galaxy/simple/images/player_sprites.png'
    spieler.sprite.x = 0
    spieler.sprite.y = 32
    spieler.pos.x = (groessen.canvas.w / 2) - 16;
    spieler.pos.y = groessen.canvas.h - spieler.target_size.h - 10;
    actors.push(spieler);

    game_tiles.src = 'themes/galaxy/simple/images/player_sprites.png'
}

function starteSpiel() {
    registerControls();
    gameInterval = setInterval(gameLoop, 20);

}

function addEnemyUfo() {
    var u = new EnemyUfo();
    u.spriteMap.src = 'themes/galaxy/simple/images/game_tiles.png';
    u.pos.x = groessen.canvas.w * 0.666;
    u.pos.y = 0;
    actors.push(u);
}

class Lasershot {
    name = 'lasershot'
    pos = { x: 0, y: 0 }
    sprite = { x: 0, y: 0 }
    source_size = { w: 16, h: 16 }
    target_size = { w: 16, h: 16 }
    spriteMap = new Image()
    speed = { x: 0, y: -10 }
    modifySpeed = function () {
        return;
    }
}

class EnemyUfo {
    name = 'ufo_1'
    pos = { x: 0, y: 0 }
    sprite = { x: 16, y: 0 }
    source_size = { w: 16, h: 16 }
    target_size = { w: 16, h: 16 }
    spriteMap = new Image()
    startTick = 0
    speed = { x: 3, y: 3 }
    speedmodifier = { x: 0.3, y: 0.3 }
    modifySpeed = function () {
        if (this.speed.x >= 3 || this.speed.x <= -3)
            this.speedmodifier.x *= -1;
        if (this.speed.y >= 3 || this.speed.y <= -3)
            this.speedmodifier.y *= -1;
        this.speed.x += this.speedmodifier.x;
        this.speed.y += this.speedmodifier.y;
    }
}

