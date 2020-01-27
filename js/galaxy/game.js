var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var theme = 'simple';
var current_level = levels[0];

var gameInterval;
// offset on top
var line_offset_y = 5;
var spriteMap = new Image;
var background = new Image;

// size details
var size = {
    tile:{ // size of tiles
        source:{w:16, h:16},
        target:{w:32, h:32}
    },
    tiles:{ // number of tiles
        target:{w:1, h:1} // this is set dynamically depending on the canvas size
    },
    canvas:{w:1, h:1} // the canvas size is read from the actual html
};

player = {
    pos: {x:0, y:0},
    sprite: {x:0, y:32},
    source_size: {w:32, h:32},
    target_size: {w:42, h:42},
    speed: {x:0, y:0},
    spriteMap: new Image,
    lives: 3
};

// initilaze the game
function initGame() {
    window.clearInterval(gameInterval);
    hideMenus(); // from menu.js
    // hideControls()
    // draw initial level for menu background
    load_level()
    showStartMenu()
}

//
function load_level() {
    initializeLevel()
    initDimensions()
    initializeTheme()
    drawLevel()
}

function drawLevel(){

}

function initializeLevel(){
    // nothing yet. use to start a new level
}

function initDimensions() {
    // re-sizing
    var canvas = document.getElementById("game");
    var browser_w = document.documentElement.clientWidth
    var browser_h = document.documentElement.clientHeight
    size.canvas.w = browser_w - 4
    size.canvas.h = browser_h - 4
    canvas.width = size.canvas.w
    canvas.height = size.canvas.h
    size.tiles.target.w = size.canvas.w / size.tile.target.w
    size.tiles.target.h = size.canvas.h / size.tile.target.h
    // if the canvas is not high enough, cut from the upper side, if it's too high, move down
    line_offset_y = size.canvas.h / size.tile.target.h - current_level.level.length
}

function initializeTheme() {
    spriteMap.src = 'themes/galaxy/' + theme + '/images/game_tiles.png';
    player.spriteMap.src = 'themes/' + theme + '/images/player_sprites.png';
    player.sprite.x = 0
    player.sprite.y = 32
    // preload_sounds()
    document.getElementById('game').style.backgroundColor = current_level.background;
    //prerenderLevelObjects();
}

// should start the game :)
window.onload = function () {
    initGame();
}



