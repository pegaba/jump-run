class Laserball {
    Typ = "Munition"
    Bildquelle = 'themes/galaxy/simple/images/Laserball_01.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 0, y: 0 },
        source_size: { x: 64, y: 64 },
        target_size: { x: 10, y: 10 }
    }
    Ort = { x: 0, y: 0 }
    Geschwindigkeit = { x: 0, y: 12 }
    Schaden = 2500
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

erstellLaserball = function (ort, korr) {
    var ls = new Laserball();
    ls.Typ = "AlienMunition";
    ls.Bild.spriteMap.src = ls.Bildquelle;
    ls.Ort.y = ort.y + korr[1];
    ls.Ort.x = ort.x + korr[0];
    ls.Geschwindigkeit.y *= 0.8;
    return ls;
}