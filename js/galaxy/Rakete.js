class Rakete {
    Typ = 'Munition'
    Bildquelle = 'themes/galaxy/simple/images/RaketeMunition.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 8, y: 0 },
        source_size: { x: 5, y: 15 },
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
    schiesseEnergiewaffe = function () {
        return null;
    }
}

erstelleRakete = function (quelle, ort, korr) {
    if (quelle == 'Spieler') {
        var r = new Rakete();
        r.Typ = 'PlayerMunition';
        r.Bild.spriteMap.src = r.Bildquelle;
        r.Bild.sprite = {x:0, y:0}
        r.Ort.y = ort.y + korr[1];
        r.Ort.x = ort.x + korr[0];
        return r;
    }
    else{
            var r = new Rakete();
            r.Typ = 'AlienMunition';
            r.Bild.spriteMap.src = r.Bildquelle;
            r.Ort.y = ort.y + korr[1];
            r.Ort.x = ort.x + korr[0];
            r.Geschwindigkeit.y *= -1;
            r.Bild.sprite = {x:6, y:0}
            return r;
    }

}