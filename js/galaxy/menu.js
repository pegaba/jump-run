function hideMenus() {
    hideStartMenu()
    hideGameOver()
    hideSiegerBild()
}

// Main menu

var button;
if (button = document.getElementById("play-level-1")) {
    button.addEventListener('click', function (event) {
        startGame(0);
    }, false);

    button.addEventListener('mouseover', function (event) {
        //current_level = levels[0];
        //load_level()
    }, false);
}

if (button = document.getElementById("button-play2")) {
    button.addEventListener('click', function (event) {
        current_level = levels[0];
        startGame();
    }, false);

    button.addEventListener('mouseover', function (event) {
        current_level = levels[0];
        load_level()
    }, false);
}

if (button = document.getElementById("button-play3")) {
    button.addEventListener('click', function (event) {
        current_level = levels[0];
        startGame();
    }, false);

    button.addEventListener('mouseover', function (event) {
        current_level = levels[0];
        load_level()
    }, false);
}

if (button = document.getElementById("button-play4")) {
    button.addEventListener('click', function (event) {
        current_level = levels[0];
        startGame();
    }, false);

    button.addEventListener('mouseover', function (event) {
        current_level = levels[0];
        load_level()
    }, false);
}


var start_menu = document.getElementById("game-menu");

function showStartMenu() {
    hideControls()
    start_menu.style.visibility = "visible";
}

function hideStartMenu() {
    start_menu.style.visibility = "hidden";
}


// Gameover menu

document.getElementById("button-restart").addEventListener('click', function (event) {
    restartGame();
}, false);

document.getElementById("button-menu").addEventListener('click', function (event) {
    ladeSpiel();
    //showStartMenu()
}, false);

var gameover_menu = document.getElementById("game-over");

function showGameOver() {
    hideControls()
    gameover_menu.style.visibility = "visible";
    gameover_menu.style.display = "";

}

function hideGameOver() {
    gameover_menu.style.visibility = "hidden";
}

var winner_menu = document.getElementById("winner-screen");

function zeigeSiegerBild() {
    _Game.Status = 'Sieg';
    winner_menu.style.visibility = "visible";
    winner_menu.style.display = "";
}

function hideSiegerBild() {
    winner_menu.style.visibility = "hidden";
}