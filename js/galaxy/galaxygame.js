// Canvas ist das Element in welchem das Spiel dargestellt ist
var canvas = document.getElementById("game");
// Auf dem Context des Canvas werden die Spielelemente gezeichnet
var ctx = canvas.getContext("2d");
// Braucht es um das Spiel am laufen zu halten
var gameInterval;
var ticks = 0, frameTime = 0, lastLoop = new Date, thisLoop, filterStrength = 20;

var _Brett = {};
var _Game = {
    AktuelleWelle: [],
    Status: "menu",
    Level: {},
    Status: 'Menu'
}

var _Spieler = {
    Raumschiff: {},
    Bild: '',
    Ort: { x: 0, y: 0 },
    AkutelleGeschwindigkeit: { x: 0, y: 0 },
    Leben: 1,
    NaechsterSchussTick: 0,
    getroffen: function (schuss) {
        if (this.Leben <= 0)
            return;

        this.Leben -= schuss.Schaden;

        if (this.Leben <= 0) {
            gameover();
            var b = new Boom();
            b.Bild.spriteMap.src = b.Bildquelle;
            b.Ort.x = this.Ort.x
            b.Ort.y = this.Ort.y
            return b;
        }

    }
}

var _Dinge = [];

// welche tasten werden gehalten
var held = { left: false, right: false, up: false, down: false, fire: false };

/**
 * Hier wird das Spiel gestartet
 */
function ladeSpiel() {
    console.log('Laden der Spieldaten');
    _Brett = Brett;
    _Brett.berechneDimensionen();
    console.log(_Brett);
    hideMenus();
    registerControls();
    showStartMenu();
}

function startGame(idx) {
    console.log('starte level 0');
    _Game.Level = levels[idx];
    hideMenus();
    selectSpielerschiff(0);
    window.clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 30);
    _Game.Status = 'running';
}

/**
 * Diese Methode erneuert das Bild und berechnet die Positionen
 */
function gameLoop() {

    updateTick();
    pruefeGruppen();


    bewegeSpieler();
    bewegeDinge();

    pruefeTreffer();
    pruefeStatus();

    zeichneBild();
}

/**
 * Sachen mit dem Tick
 */
function updateTick() {
    ticks++

    var thisFrameTime = (thisLoop = new Date) - lastLoop;
    frameTime += (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}

/**
 * Hat es noch Gegner oder muss eine neue Welle gestartet werden
 */
function pruefeGruppen() {
    var idx = _Dinge.findIndex((d) => { return d.Typ == "Gegner" });

    if (idx == -1) {
        var w = [];
        w = _Game.Level.Gruppen[0]
        _Game.Level.Gruppen.splice(0, 1);

        for (var i = 0; i < w.Anzahl; i++) {
            var u = new Ufo01();
            u.Bild.spriteMap.src = u.Bildquelle;
            u.Starttick = ticks + w.Start + (i * w.Pause);
            u.WellePos = i;
            _Dinge.push(u);
        }
    }
}

/**
 * prüfen ob der Spieler irgendwelche Tasten gedrückt hat
 */
function bewegeSpieler() {
    if (_Game.Status != 'running') {
        return;
    }

    _Spieler.AkutelleGeschwindigkeit.x = 0;
    _Spieler.AkutelleGeschwindigkeit.y = 0;
    if (held.left) {
        _Spieler.AkutelleGeschwindigkeit.x = -_Spieler.Raumschiff.Geschwindigkeit.x;
    }
    if (held.right) {
        _Spieler.AkutelleGeschwindigkeit.x = _Spieler.Raumschiff.Geschwindigkeit.x;
    }
    if (held.up) {
        _Spieler.AkutelleGeschwindigkeit.y = -_Spieler.Raumschiff.Geschwindigkeit.y;
    }
    if (held.down) {
        _Spieler.AkutelleGeschwindigkeit.y = _Spieler.Raumschiff.Geschwindigkeit.y;
    }

    // neue Position des Spielers berechnen
    _Spieler.Ort.x += _Spieler.AkutelleGeschwindigkeit.x;
    _Spieler.Ort.y += _Spieler.AkutelleGeschwindigkeit.y;

    // Pruefen dass der Spieler nicht aus dem Brett fliegt
    if (_Spieler.Ort.x <= 0)
        _Spieler.Ort.x = 0;
    if (_Spieler.Ort.x >= _Brett.Groesse.x - _Spieler.Bild.target_size.x)
        _Spieler.Ort.x = _Brett.Groesse.x - _Spieler.Bild.target_size.x;
    if (_Spieler.Ort.y <= 0)
        _Spieler.Ort.y = 0;
    if (_Spieler.Ort.y >= _Brett.Groesse.y - _Spieler.Bild.target_size.y)
        _Spieler.Ort.y = _Brett.Groesse.y - _Spieler.Bild.target_size.y;

    // Spieler will schiessen
    if (held.fire) {
        if (ticks >= _Spieler.NaechsterSchussTick) {
            var schuss = _Spieler.Raumschiff.schiessen(_Spieler.Ort)
            _Dinge = _Dinge.concat(schuss);
            _Spieler.NaechsterSchussTick = (ticks + _Spieler.Raumschiff.Schussabstand);
        }

    }

}

/**
 * alle Dinge welche sich bewegen können, müssen sich bewegen
 */
function bewegeDinge() {
    for (var i = _Dinge.length - 1; i >= 0; i--) {
        var ding = _Dinge[i];
        if (ding.Starttick < ticks) {
            ding.bewegen();
            var schuss = ding.schiessen();
            if (schuss) {
                _Dinge.push(schuss);
            }

        }
    }
}

/**
 * Ist irgendetwas getroffen worden?
 */
function pruefeTreffer() {
    var muni = _Dinge.filter((m) => { return m.Typ == "PlayerMunition" });
    var gegn = _Dinge.filter((g) => { return g.Typ == "Gegner" });

    // prüfe alle Gegner mit allen Projektile
    gegn.forEach((ge) => {
        muni.forEach((m) => {
            IstGetroffen(m, ge);
        });
    });

    // pruefe Spieler mit allen Projektilen
    muni = _Dinge.filter((m)=> {return m.Typ == "AlienMunition"});
    muni.forEach((m) => {
        IstGetroffen(m, _Spieler);
    });
}

function IstGetroffen(schuss, schiff) {
    // nicht mal in der Nähe -> weiter
    if (schiff.Ort.x - 10 > schuss.Ort.x)
        return;

    // schon mal in der gleichen Spalte
    if (schiff.Ort.x < schuss.Ort.x &&
        schiff.Ort.x + schiff.Bild.target_size.x > schuss.Ort.x) {
        if (schiff.Ort.y < schuss.Ort.y &&
            schiff.Ort.y + schiff.Bild.target_size.y > schuss.Ort.y) {
            var e = schiff.getroffen(schuss);
            if (e) {
                _Dinge.push(e);
            }
            schuss.Status = -1;
        }
    }
}

/**
 * Können Dinge entfernt werden? 
 */
function pruefeStatus() {
    for (var idx = _Dinge.length - 1; idx >= 0; idx--) {
        var ding = _Dinge[idx];
        ding.pruefeStatus();
        if (ding.Status < 0) {
            _Dinge.splice(idx, 1);
        }
    }
}

/**
 * alle Spielelemente müssen gezeichnet werden
 */
function zeichneBild() {
    // alles löschen
    ctx.clearRect(0, 0, _Brett.Groesse.x, _Brett.Groesse.y);

    // zeichne Raumschiff
    if (_Game.Status == 'running') {
        ctx.drawImage(
            _Spieler.Bild.spriteMap,
            _Spieler.Bild.sprite.x,
            _Spieler.Bild.sprite.y,
            _Spieler.Bild.source_size.x,
            _Spieler.Bild.source_size.y,
            _Spieler.Ort.x,
            _Spieler.Ort.y,
            _Spieler.Bild.target_size.x,
            _Spieler.Bild.target_size.y

        );
    }

    // zeichne alle Dinge
    _Dinge.forEach(function (ding) {
        if (ding.Starttick > ticks) {
            return;
        }
        ctx.drawImage(
            ding.Bild.spriteMap,
            ding.Bild.sprite.x,
            ding.Bild.sprite.y,
            ding.Bild.source_size.x,
            ding.Bild.source_size.y,
            ding.Ort.x,
            ding.Ort.y,
            ding.Bild.target_size.x,
            ding.Bild.target_size.y

        );
    });

    // zeichne Anzeige
    ctx.beginPath();
    ctx.moveTo(600, 1);
    ctx.lineTo(600, 800);
    ctx.stroke();
}
var leben = new Image();
leben.src = "themes/galaxy/simple/images/game_tiles.png";
ctx.drawImage(
    leben,
    1, 17, 16, 16, 650, 750, 25, 25
)

/**
 * wählt ein Schiff aus der Schiffliste
 * @param {int} idx - Index des Schiffes in der Schiffliste
 */
function selectSpielerschiff(idx) {
    Object.assign(_Spieler.Raumschiff, schiffe[idx]);
    _Spieler.Bild = _Spieler.Raumschiff.Bild;
    _Spieler.Leben = _Spieler.Raumschiff.Leben;
    _Spieler.Bild.spriteMap.src = _Spieler.Raumschiff.Bildquelle;
    _Spieler.Ort.x = (_Brett.Groesse.x / 2) - (_Spieler.Bild.target_size.x / 2)
    _Spieler.Ort.y = (_Brett.Groesse.y - 50)
}

function gameover() {
    showGameOver();

    _Game.Status = 'gameover';
}