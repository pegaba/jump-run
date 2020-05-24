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
var _zDinge = [];

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
    _Dinge = [];
    _Game = {
        AktuelleWelle: [],
        Status: "menu",
        Level: {},
        Status: 'Menu'
    };
}

function startGame(idx) {
    console.log('starte level 0');
    _Game.Level = GetLevel(idx);
    hideMenus();
    selectSpielerschiff(0);
    window.clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 30);
    _Game.Status = 'running';
}

function restartGame() {
    console.log('Restart');
    _Dinge = [];
    _Game = {
        AktuelleWelle: [],
        Status: "menu",
        Level: {},
        Status: 'Menu'
    };
    startGame(0);
}

/**
 * Diese Methode erneuert das Bild und berechnet die Positionen
 */
function gameLoop() {
    _zDinge = [];
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
        if (_Game.Level.Gruppen.length == 0) {
            zeigeSiegerBild();
            return;
        }


        w = _Game.Level.Gruppen[0]
        _Game.Level.Gruppen.splice(0, 1);

        for (var i = 0; i < w.Anzahl; i++) {
            if (w.Gegner == 'Ufo_01') {
                var u = new Ufo01();
            }
            else if (w.Gegner == 'Boss_01') {
                var u = new Boss01();
                u.LaserStartTick = ticks + w.Start + (i * w.Pause) + 100;
            } else if (w.Gegner == 'Ufo_02') {
                var u = new Ufo02();
                u.Ort.y = 50;
            } else if (w.Gegner == 'Boss_02') {
                var u = new Boss02();
            } else if (w.Gegner == 'Ufo_03') {
                var u = new Ufo03();
            }
            else if (w.Gegner == 'Boss_03') {
                var u = new Boss_03();
            }

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

    // Spieler will Rakete abschiessen
    if (held.v) {
        if (_Spieler.Raumschiff.raketeBereit(ticks)) {
            var rakete = _Spieler.Raumschiff.schiesseRakete(_Spieler.Ort, ticks)
            _Dinge = _Dinge.concat(rakete);
            _Spieler.RaketeBereitTick = (ticks + _Spieler.Raumschiff.RaketeLadenZeit)
            held.v = false;
        }
    }

    // Spieler schiesst Laserstrahl
    if (held.c) {
        var l = _Spieler.Raumschiff.schiesseEnergiewaffe(_Spieler.Ort);
        if (l && l.length > 0) {
            _zDinge = _zDinge.concat(l);
        }
    }


    _Spieler.Raumschiff.pruefeStatus(ticks);
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
                _Dinge = _Dinge.concat(schuss);
            }

            var energieSchuss = ding.schiesseEnergiewaffe();
            if (energieSchuss && energieSchuss.length > 0) {
                _zDinge = _zDinge.concat(energieSchuss);
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
    muni = _Dinge.filter((m) => { return m.Typ == "AlienMunition" });
    muni.forEach((m) => {
        IstGetroffen(m, _Spieler);
    });

    strahl = _zDinge.filter((s) => { return s.Typ == 'Spielerwaffe' });
    strahl.forEach((s) => {
        gegn.forEach((ge) => {
            s.trifft(ge);
        });
    });

    //AlienWaffe
    strahl = _zDinge.filter((s) => { return s.Typ == 'AlienWaffe' });
    strahl.forEach((s) => {
        s.trifft(_Spieler);
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

    _zDinge.forEach(function (z) {
        z.zeichenFunktion(ctx);
    });

    // setze Farbe zurück
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    // zeichne Anzeige
    // übermale Anzeigebereich weiss
    ctx.beginPath();
    ctx.rect(600, 1, 800, 800);
    ctx.fillStyle = "white";
    ctx.fillRect(600, 1, 200, 800);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(600, 1);
    ctx.lineTo(600, 800);
    ctx.stroke();
    zeichneLeben();
    zeichneLaserstrahl();
}


function zeichneLeben() {
    var b = 0;
    var v = _Spieler.Raumschiff.Lebensteile - Math.ceil(_Spieler.Raumschiff.Lebensteile * (_Spieler.Leben - 1000) / (_Spieler.Raumschiff.MaximalesLeben - 1000));


    var leben = new Image();
    leben.src = "themes/galaxy/simple/images/Lebensanzeige.png";
    ctx.drawImage(
        leben,
        0, (v * 20), 82, 18, 620, 720, 164, 36
    )

}
function zeichneLaserstrahl() {
    var v = 7 - Math.ceil(7 * _Spieler.Raumschiff.Laserenergie / 100);


    var leben = new Image();
    leben.src = "themes/galaxy/simple/images/Laserstrahl.png";
    ctx.drawImage(
        leben,
        0, (v * 20), 82, 18, 620, 680, 164, 36
    )

}

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