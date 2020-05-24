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
        ZerstorerkugelLTick: 0,
        ZerstorerkugelRTick: 0,
        Zerstorerkugelabstand: 100,
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
            var k1 = [13, 24]
            var k2 = [51, 24]
            var s = []
            s.push(erstelleschuss(ort, r1));
            s.push(erstelleschuss(ort, r2));
            s.push(erstelleschuss(ort, r3));
            s.push(erstelleschuss(ort, r4));
            if (this.ZerstorerkugelRTick < ticks) {
                var k = erstelleZerstoererkugel('Spieler', ort, k1);

                this.ZerstorerkugelRTick = ticks + this.Zerstorerkugelabstand;
                this.ZerstorerkugelLTick = ticks + (0.5 * this.Zerstorerkugelabstand);
                s.push(k);
            }
            if (this.ZerstorerkugelLTick < ticks) {
                var k = erstelleZerstoererkugel('Spieler', ort, k2);
                this.ZerstorerkugelRTick = ticks + (0.5 * this.Zerstorerkugelabstand);
                this.ZerstorerkugelLTick = ticks + this.Zerstorerkugelabstand;
                s.push(k);
            }
            return s;
        },
        schiesseEnergiewaffe: function (ort) {
            if (this.Laserenergie > 0) {
                this.Laserenergie = this.Laserenergie - 1;
                var ls = new Laserstrahl();
                ls.Ort.x = ort.x + this.LaserstrahlKorrektur[0];
                ls.Ort.y = ort.y + this.LaserstrahlKorrektur[1];
                ls.End.x = ort.x + this.LaserstrahlKorrektur[0];
                ls.End.y *= ls.YRichtung;

                return [ls];
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
                return erstelleRakete('Spieler', ort, r1);
            }
            else if (this.Rakete2Tick < tick) {
                this.Rakete2Tick = (tick + this.Raketenabstand);
                return erstelleRakete('Spieler', ort, r2);
            }
            return null;
        },
        pruefeStatus: function () {
            console.log(this.Laserenergie);
            if (this.Laserenergie < 100 && ticks % 5 == 0) {
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
    schiesseEnergiewaffe = function () {
        return null;
    }
}

erstelleschuss = function (ort, korr) {
    var ls = new Laserschuss();
    ls.Typ = "PlayerMunition";
    ls.Bild.spriteMap.src = ls.Bildquelle;
    ls.Ort.y = ort.y + korr[1];
    ls.Ort.x = ort.x + korr[0];
    ls.Schaden = 500;

    return ls;
}



