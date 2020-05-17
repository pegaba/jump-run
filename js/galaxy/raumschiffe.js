var schiffe = [
    {
        Bildquelle: 'themes/galaxy/simple/images/player_sprites.png',
        Bild: {
            spriteMap: new Image(),
            sprite: { x: 0, y: 0 },
            source_size: { x: 64, y: 64 },
            target_size: { x: 64, y: 64 }
        },
        Geschwindigkeit: { x: 10, y: 10 },
        Schussabstand: 10,
        Raketenabstand: 300,
        MaximalesLeben: 50000,
        Leben: 50000,
        Lebensteile: 7,
        Laserenergie: 100,
        LaserstrahlKorrektur: [32, 1],
        schiessen: function (ort) {
            var r1 = [3, 21]
            var r2 = [6, 21]
            var r3 = [57, 21]
            var r4 = [60, 21]

            var s = []
            s.push(erstelleschuss(ort, r1));
            s.push(erstelleschuss(ort, r2));
            s.push(erstelleschuss(ort, r3));
            s.push(erstelleschuss(ort, r4));

            return s;
        },
        schiesseLaserstrahl: function (ort) {
            if (this.Laserenergie > 0) {
                this.Laserenergie = this.Laserenergie - 1;
                var ls =  new Laserstrahl();
                ls.Ort.x = ort.x + this.LaserstrahlKorrektur[0];
                ls.Ort.y = ort.y + this.LaserstrahlKorrektur[1];
                return ls;
            }
            return null;
        },

        Rohr: 1,
        Rakete1Tick: 0,
        Rakete2Tick: 0,
        raketeBereit: function (tick) {
            return this.Rakete1Tick < tick || this.Rakete2Tick < tick;
        },
        schiesseRakete: function (ort, tick) {
            var r1 = [23, 46];
            var r2 = [40, 46];
            if (this.Rakete1Tick < tick) {
                this.Rakete1Tick = (tick + this.Raketenabstand);
                return erstelleRakete(ort, r1);
            }
            else if (this.Rakete2Tick < tick) {
                this.Rakete2Tick = (tick + this.Raketenabstand);
                return erstelleRakete(ort, r2);
            }
            return null;
        },
        pruefeStatus: function (tick) {
            console.log(this.Laserenergie);
            if (this.Laserenergie < 100 && tick % 5 == 0) {
                this.Laserenergie += 1;
            }
        }

    }
]

class Laserschuss {
    Typ = "Munition"
    Bildquelle = 'themes/galaxy/simple/images/game_tiles.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 0, y: 0 },
        source_size: { x: 3, y: 11 },
        target_size: { x: 3, y: 11 }
    }
    Ort = { x: 0, y: 0 }
    Geschwindigkeit = { x: 0, y: -12 }
    Schaden = 1000
    Starttick = 0
    Status = 0
    bewegen = function () {
        this.Ort.x += this.Geschwindigkeit.x;
        this.Ort.y += this.Geschwindigkeit.y;
    }
    pruefeStatus = function () {
        if (this.Ort.y < -100)
            this.Status = -1;
        if (this.Ort.y > 1000)
            this.Status = -1;
    }
    schiessen = function () {
        return null;
    }
}

erstelleschuss = function (ort, korr) {
    var ls = new Laserschuss();
    ls.Typ = "PlayerMunition";
    ls.Bild.spriteMap.src = ls.Bildquelle;
    ls.Ort.y = ort.y + korr[1];
    ls.Ort.x = ort.x + korr[0];

    return ls;
}

class Rakete {
    Typ = 'Munition'
    Bildquelle = 'themes/galaxy/simple/images/rllk.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 8, y: 0 },
        source_size: { x: 8, y: 16 },
        target_size: { x: 16, y: 32 }
    }
    Ort = { x: 0, y: 0 }
    Geschwindigkeit = { x: 0, y: -5 }
    Schaden = 5000
    Starttick = 0
    Status = 0
    bewegen = function () {
        this.Ort.x += this.Geschwindigkeit.x;
        this.Ort.y += this.Geschwindigkeit.y;
    }
    pruefeStatus = function () {
        if (this.Ort.y < -100)
            this.Status = -1;
        if (this.Ort.y > 1000)
            this.Status = -1;
    }
    schiessen = function () {
        return null;
    }
}

erstelleRakete = function (ort, korr) {
    var r = new Rakete();
    r.Typ = 'PlayerMunition';
    r.Bild.spriteMap.src = r.Bildquelle;
    r.Ort.y = ort.y + korr[1];
    r.Ort.x = ort.x + korr[0];
    return r;
}

class Laserstrahl {
    Schaden = 50 // pro tick
    Ort = { x: 0, y: 0 }
    YRichtung = 1
    Typ = 'Spielerwaffe'
    zeichenFunktion = function (ctx) {
        ctx.beginPath();
        ctx.moveTo(_Spieler.Ort.x + _Spieler.Raumschiff.LaserstrahlKorrektur[0], _Spieler.Ort.y + _Spieler.Raumschiff.LaserstrahlKorrektur[1]);
        ctx.lineTo(_Spieler.Ort.x + _Spieler.Raumschiff.LaserstrahlKorrektur[0], 0);
        //ctx.strokeStyle = gradient;
        var gradient = ctx.createLinearGradient(0, 1000, 0, 0);
        gradient.addColorStop("0", "red");
        gradient.addColorStop("0.5", "purple");
        gradient.addColorStop("1", "gold");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 5;
        ctx.stroke();
    }
    trifft = function (gegner) {
        if (this.YRichtung > 0) {
            if (gegner.Ort.y < this.Ort.y && gegner.Ort.x < this.Ort.x && (gegner.Ort.x + gegner.Bild.target_size.x) > this.Ort.x) {
                gegner.getroffen(this);
            }
        }

    }
}